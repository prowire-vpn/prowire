import {
  SubscribeMessage,
  MessageBody,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import {WebSocket} from 'ws';
import {IncomingMessage} from 'http';
import {Logger} from '@nestjs/common';
import {StartServerEvent, StopServerEvent} from './server.gateway.dto';
import {Server, VpnConfig} from 'server/domain';
import * as Joi from 'joi';
import {WebSocketMessage} from './server.gateway.dto';
import {Interval} from '@nestjs/schedule';
import {
  ServerHealthyEvent,
  ServerConnectedEvent,
  ServerDisconnectedEvent,
  ServerReadyEvent,
  ServerStoppedEvent,
} from 'server/domain/server.events';
import {EventEmitter2} from '@nestjs/event-emitter';

const headerSchema = Joi.object({
  'x-prowire-server-name': Joi.string().required(),
  'x-prowire-server-ip': Joi.string().ip().required(),
  'x-prowire-server-port': Joi.number().port().required(),
  'x-prowire-server-public-key': Joi.string().base64().required(),
});

export interface ExtendedWebSocket extends WebSocket {
  name: string;
}

@WebSocketGateway({transports: ['websocket'], pingInterval: 1_000, pingTimeout: 3_000})
export class ServerGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private clients: {[name: string]: WebSocket} = {};

  private readonly logger = new Logger(ServerGateway.name);

  constructor(private readonly eventEmitter: EventEmitter2) {}

  public get clientCount(): number {
    return Object.keys(this.clients).length;
  }

  public async handleConnection(
    socket: ExtendedWebSocket,
    request: IncomingMessage,
  ): Promise<void> {
    const serverData = this.getServerDataFromRequest(request);
    if (!serverData) return socket.close();
    socket.name = serverData.name;
    this.storeSocket(serverData.name, socket);
    this.logger.log(`VPN server connected [${serverData.name}]`);

    /** Listen to health-checks and ensures servers are healthy */
    socket.on('pong', () => {
      this.eventEmitter.emit(ServerHealthyEvent.namespace, new ServerHealthyEvent(serverData.name));
    });

    this.eventEmitter.emit(ServerConnectedEvent.namespace, new ServerConnectedEvent(serverData));
  }

  public async handleDisconnect(socket: ExtendedWebSocket): Promise<void> {
    if (!socket.name) throw new Error('Socket name not set');
    this.logger.log(`VPN server disconnected [${socket.name}]`);
    this.eventEmitter.emit(
      ServerDisconnectedEvent.namespace,
      new ServerDisconnectedEvent(socket.name),
    );
    this.removeSocket(socket.name);
  }

  private getServerDataFromRequest(request: IncomingMessage) {
    const {error, value} = headerSchema.validate(request.headers, {allowUnknown: true});
    if (error) {
      this.logger.warn(error);
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
  private async serverReady(@ConnectedSocket() client: ExtendedWebSocket): Promise<void> {
    this.eventEmitter.emit(ServerReadyEvent.namespace, new ServerReadyEvent(client.name));
  }

  @SubscribeMessage('server-stop')
  private async serverStopped(@ConnectedSocket() client: ExtendedWebSocket): Promise<void> {
    this.eventEmitter.emit(ServerStoppedEvent.namespace, new ServerStoppedEvent(client.name));
  }

  @SubscribeMessage('byte-count')
  private byteCount(@MessageBody() data: string): void {
    console.log('byte-count');
    console.log(data);
  }
}
