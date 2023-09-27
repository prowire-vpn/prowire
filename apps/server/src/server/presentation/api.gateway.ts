import WS, {WebSocket, type RawData} from 'ws';
import {
  Injectable,
  Logger,
  type OnApplicationBootstrap,
  type OnModuleDestroy,
} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {PkiService} from 'server/domain';
import {getPublicIp} from 'utils';
import {ShutdownService} from 'lifecycle';
import {EventEmitter2} from '@nestjs/event-emitter';
import {ApiGatewayConnected} from './api.gateway.event';
import {type HandlerFunction, type MessageHandlersMap} from './api.gateway.interface';
import {WebSocketMessage} from '@prowire-vpn/api';
import {deserialize} from 'bson';

@Injectable()
export class ApiGateway implements OnApplicationBootstrap, OnModuleDestroy {
  /** Websocket connection */
  private webSocket?: WebSocket;
  /** Number of continuous failures */
  private failures = 0;
  /** Handlers for the different message types */
  private handlers: MessageHandlersMap = {};

  private readonly logger = new Logger(ApiGateway.name);

  public constructor(
    private readonly configService: ConfigService,
    private readonly pkiService: PkiService,
    private readonly shutdownService: ShutdownService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /** Start the API connection when app is ready */
  public onApplicationBootstrap() {
    this.connect();
  }

  public onModuleDestroy() {
    if (this.webSocket) this.webSocket.close();
  }

  /** Establish a connection with the server */
  public async connect(): Promise<void> {
    this.logger.log('Establishing connection to API');
    // Generate websocket address from http URL
    const webSocketAddress = this.configService
      .getOrThrow('API_URL')
      .replace('http://', 'ws://')
      .replace('https://', 'wss://');
    this.webSocket = new WS(webSocketAddress, {
      headers: {
        authorization: `Bearer ${this.configService.getOrThrow<string>('VPN_SERVER_SECRET')}`,
        'X-Prowire-Server-Name': this.configService.getOrThrow<string>('VPN_SERVER_ID'),
        // We put the base64 representation of the public key, as whitespace chars aren't supported in headers
        'X-Prowire-Server-Public-Key': Buffer.from(
          this.pkiService.getKeyPair().public,
          'utf-8',
        ).toString('base64'),
        // Port at which the VPN server is available
        'X-Prowire-Server-Port': this.configService.getOrThrow<number>('VPN_SERVER_PORT'),
        // IP at which the VPN server is available
        'X-Prowire-Server-IP':
          this.configService.get<string>('VPN_SERVER_PUBLIC_HOST') ?? (await getPublicIp()),
      },
    });

    this.webSocket.on('open', () => {
      this.logger.log('Connection to API established');
      this.failures = 0;
      this.eventEmitter.emit(ApiGatewayConnected.eventName);
    });

    this.webSocket.on('error', (error: unknown) => {
      this.logger.error(error);
    });

    /** Connection close handler */
    this.webSocket.on('close', this.onClose.bind(this));

    this.webSocket.on('pong', () => {
      this.webSocket?.ping();
    });

    this.webSocket.on('message', this.onMessage.bind(this));
  }

  /** Function called when a message is received from the API */
  private onMessage(data: RawData): void {
    // If we receive an array, we process each message independently
    if (data instanceof Array) {
      data.forEach((element) => {
        this.onMessage(element);
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

      this.logger.verbose(`Received message of type "${message.type}"`, message.payload);

      // Pass the message to all the related handlers
      this.handlers[message.type].forEach((handler) => {
        handler(message.payload);
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

  /** Function handling socket closing */
  private onClose(code: number): void {
    // If we exited with an error, we retry the connection failures x 1 seconds later
    if (code === 1006) {
      this.failures += 1;
      if (this.failures <= 5) {
        this.logger.log(
          `Connection to API failed, attempting to reconnect in ${this.failures} seconds`,
        );
        setTimeout(() => {
          this.connect().catch((error: unknown) => {
            this.logger.error(error);
          });
        }, 1000 * this.failures);
        return;
      }
      this.logger.error(
        `Failed to connect to the API ${this.failures} times. Will not re-attempt. Halting now`,
      );
      this.shutdownService.shutdown();
      return;
    }
    this.logger.log('Disconnected gracefully. Shutting-off now');
  }

  public send(message: WebSocketMessage<unknown>): void {
    if (!this.webSocket) throw new Error('No websocket connection');
    this.logger.verbose(`Sending message of type "${message.type}"`, message.payload);
    this.webSocket?.send(message.serialize());
  }
}
