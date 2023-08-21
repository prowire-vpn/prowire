import WS, {WebSocket} from 'ws';
import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnModuleDestroy,
  Inject,
  forwardRef,
} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {MessageService, PkiService} from 'server/domain';
import {getPublicIp} from 'utils';
import {ShutdownService} from 'lifecycle';
import {EventEmitter2} from '@nestjs/event-emitter';
import {ApiGatewayConnected} from './api.gateway.event';

@Injectable()
export class ApiGateway implements OnApplicationBootstrap, OnModuleDestroy {
  /** Websocket connection */
  webSocket?: WebSocket;
  /** Number of continuous failures */
  failures = 0;

  private readonly logger = new Logger(ApiGateway.name);

  public constructor(
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => MessageService)) private readonly messageService: MessageService,
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
          this.configService.get<string>('VPN_SERVER_PUBLIC_URL') ?? (await getPublicIp()),
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

    this.webSocket.on('message', this.messageService.onMessage.bind(this.messageService));
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

  public send(event: string, data?: unknown): void {
    if (!this.webSocket) throw Error('No websocket connection');
    this.webSocket?.send(JSON.stringify({event, data}));
  }
}
