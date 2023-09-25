import {
  WebSocketGateway,
  type OnGatewayConnection,
  type OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import {WebSocket} from 'ws';
import {IncomingMessage} from 'http';
import {Logger} from '@nestjs/common';
import {Server} from 'server/domain/server.entity';
import * as Joi from 'joi';
import {WebSocketMessage} from './server.gateway.dto';
import {Interval} from '@nestjs/schedule';
import {
  ServerHealthyEvent,
  ServerConnectedEvent,
  ServerDisconnectedEvent,
} from 'server/domain/server.events';
import {EventEmitter2} from '@nestjs/event-emitter';
import {type RawData} from 'ws';
import {deserialize} from 'bson';

const headerSchema = Joi.object({
  'x-prowire-server-name': Joi.string().required(),
  'x-prowire-server-ip': Joi.string().ip().required(),
  'x-prowire-server-port': Joi.number().port().required(),
  'x-prowire-server-public-key': Joi.string().base64().required(),
});

export interface ExtendedWebSocket extends WebSocket {
  name: string;
}

/** Function that does some business logic on a message */
export type HandlerFunction = (serverName: string, message: WebSocketMessage['payload']) => void;

/** Mapping of all registered message handlers */
export interface MessageHandlersMap {
  [type: string]: Array<HandlerFunction>;
}

@WebSocketGateway({transports: ['websocket'], pingInterval: 1_000, pingTimeout: 3_000})
export class ServerGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private clients: {[name: string]: WebSocket} = {};
  private handlers: MessageHandlersMap = {};

  private readonly logger = new Logger(ServerGateway.name);

  constructor(private readonly eventEmitter: EventEmitter2) {}

  public get clientCount(): number {
    return Object.keys(this.clients).length;
  }

  /** Triggered when a new client connects */
  public async handleConnection(
    socket: ExtendedWebSocket,
    request: IncomingMessage,
  ): Promise<void> {
    this.logger.debug(`VPN server attempting to connect`);
    const serverData = this.getServerDataFromRequest(request);
    if (!serverData) return socket.close();
    socket.name = serverData.name;
    this.storeSocket(serverData.name, socket);
    this.logger.log(`VPN server connected [${serverData.name}]`);

    // Listen to health-checks and ensures servers are healthy
    socket.on('pong', () => {
      this.eventEmitter.emit(ServerHealthyEvent.namespace, new ServerHealthyEvent(serverData.name));
    });

    socket.on('message', (data) => this.onMessage(data, socket));

    this.eventEmitter.emit(ServerConnectedEvent.namespace, new ServerConnectedEvent(serverData));
  }

  /** Triggered when a client disconnects */
  public async handleDisconnect(socket: ExtendedWebSocket): Promise<void> {
    if (!socket.name) throw new Error('Socket name not set');
    this.logger.log(`VPN server disconnected [${socket.name}]`);
    this.eventEmitter.emit(
      ServerDisconnectedEvent.namespace,
      new ServerDisconnectedEvent(socket.name),
    );
    this.removeSocket(socket.name);
  }

  /** Force disconnect a client */
  public async disconnectServer(server: Server): Promise<void> {
    const socket = this.getSocket(server.name);
    socket?.close();
  }

  /** Parses the header of the client request to extract connection information */
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

  /** Send a message to a connected client */
  public sendMessage(server: string | Server, message: WebSocketMessage): void {
    const serverName = typeof server === 'string' ? server : server.name;
    const socket = this.getSocket(serverName);
    if (!socket) {
      this.logger.error(`Could not find socket for server ${serverName}`);
      return;
    }
    this.logger.verbose(
      `Sending message of type "${message.type}" to "${serverName}"`,
      message.payload,
    );
    socket.send(message.serialize());
  }

  /** Every second we send a ping to all connected instances to ensure they are still active */
  @Interval(1_000)
  private sendPing(): void {
    Object.values(this.clients).forEach((client) => {
      client.ping();
    });
  }

  /** Function called when a message is received from the API */
  private onMessage(data: RawData, @ConnectedSocket() client: ExtendedWebSocket): void {
    // If we receive an array, we process each message independently
    if (data instanceof Array) {
      data.forEach((element) => {
        this.onMessage(element, client);
      });
      return;
    }
    try {
      // Parse the message
      let message: WebSocketMessage;
      try {
        message = deserialize(data) as WebSocketMessage;
      } catch (error) {
        throw new Error('Could not parse incoming message as BSON');
      }

      // Check that the message type is handled
      if (!(message.type in this.handlers))
        throw new Error(`Message with type "${message.type}" is not handled by this server`);

      this.logger.verbose(
        `Received message of type "${message.type}" from "${client.name}"`,
        message.payload,
      );

      // Pass the message to all the related handlers
      this.handlers[message.type].forEach((handler) => {
        handler(client.name, message.payload);
      });
    } catch (error: unknown) {
      this.logger.error(error);
    }
  }

  /** Add a message handler to the chain */
  public registerHandler(type: string, handler: HandlerFunction): void {
    if (!this.handlers[type]) this.handlers[type] = [];
    this.logger.debug(`Registering message handler "${handler.name}" for "${type}"`);
    this.handlers[type].push(handler);
  }
}
