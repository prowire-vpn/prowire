import {
  SubscribeMessage,
  MessageBody,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import {Inject, forwardRef} from '@nestjs/common';
import {WebSocket} from 'ws';
import {IncomingMessage} from 'http';
import {Logger} from '@nestjs/common';
import {StartServerEvent, StopServerEvent} from './server.gateway.dto';
import {ServerService, Server, VpnConfig} from 'server/domain';
import * as Joi from 'joi';
import {WebSocketMessage} from './server.gateway.dto';
import {Interval} from '@nestjs/schedule';

const headerSchema = Joi.object({
  'x-prowire-server-name': Joi.string().required(),
  'x-prowire-server-ip': Joi.string().ip().required(),
  'x-prowire-server-port': Joi.number().port().required(),
  'x-prowire-server-public-key': Joi.string().base64().required(),
});

interface ExtendedWebSocket extends WebSocket {
  name: string;
}

@WebSocketGateway({transports: ['websocket'], pingInterval: 1_000, pingTimeout: 3_000})
export class ServerGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private clients: {[name: string]: WebSocket} = {};

  private readonly logger = new Logger(ServerGateway.name);

  constructor(
    @Inject(forwardRef(() => ServerService)) private readonly serverService: ServerService,
  ) {}

  public async handleConnection(
    socket: ExtendedWebSocket,
    request: IncomingMessage,
  ): Promise<void> {
    const severData = this.getServerDataFromRequest(request);
    if (!severData) return socket.close();
    socket.name = severData.name;
    this.storeSocket(severData.name, socket);
    this.logger.log(`VPN server connected [${severData.name}]`);

    /** Listen to health-checks and ensures servers are healthy */
    socket.on('pong', () => {
      this.serverService.healthy(severData.name).catch((error) => {
        this.logger.error(error);
      });
    });

    await this.serverService.connected(severData);
  }

  public async handleDisconnect(socket: ExtendedWebSocket): Promise<void> {
    if (!socket.name) throw new Error('Socket name not set');
    this.logger.log(`VPN server disconnected [${socket.name}]`);
    await this.serverService.disconnected(socket.name);
    this.removeSocket(socket.name);
  }

  private getServerDataFromRequest(request: IncomingMessage) {
    const {error, value} = headerSchema.validate(request.headers, {allowUnknown: true});
    if (error) {
      this.logger.error(error);
      return;
    }

    return {
      name: value['x-prowire-server-name'],
      ip: value['x-prowire-server-ip'],
      port: value['x-prowire-server-port'],
      publicKey: Buffer.from(value['x-prowire-server-public-key'], 'base64').toString('utf-8'),
    };
  }

  private storeSocket(name: string, socket: WebSocket) {
    this.clients[name] = socket;
  }

  private removeSocket(name: string) {
    delete this.clients[name];
  }

  private getSocket(name: string): WebSocket | undefined {
    return this.clients[name];
  }

  public sendStartMessage(server: Server, vpnConfig: VpnConfig, certificate: string, ca: string) {
    this.sendMessage(server, new StartServerEvent(vpnConfig, certificate, ca));
  }

  public sendStopMessage(server: Server) {
    this.sendMessage(server, new StopServerEvent());
  }

  private sendMessage(server: Server, message: WebSocketMessage) {
    const socket = this.getSocket(server.name);
    if (!socket) {
      this.logger.error(`Could not find socket for server ${server.name}`);
      return;
    }
    socket.send(message.serialize());
  }

  /** Every second we send a ping to all connected instances to ensure they are still active */
  @Interval(1_000)
  private sendPing(): void {
    Object.values(this.clients).forEach((client) => {
      client.ping();
    });
  }

  @SubscribeMessage('server-ready')
  async serverReady(@ConnectedSocket() client: ExtendedWebSocket): Promise<void> {
    await this.serverService.ready(client.name);
  }

  @SubscribeMessage('server-stop')
  async serverStopped(@ConnectedSocket() client: ExtendedWebSocket): Promise<void> {
    await this.serverService.stopped(client.name);
  }

  @SubscribeMessage('byte-count')
  byteCount(@MessageBody() data: string): void {
    console.log('byte-count');
    console.log(data);
  }
}
