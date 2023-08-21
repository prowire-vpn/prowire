import {Injectable, Logger} from '@nestjs/common';
import {Telnet} from 'telnet-client';
import {setTimeout} from 'timers/promises';
import {existsSync} from 'fs';
import {ShutdownService} from 'lifecycle';
import {messages, ServerReadyEvent} from './telnet.message';
import {EventEmitter2} from '@nestjs/event-emitter';

@Injectable()
export class TelnetManager {
  private telnet?: Telnet;
  public readonly TELNET_SOCKET_PATH = '/tmp/prowire-openvpn';

  private readonly logger = new Logger(TelnetManager.name);

  public constructor(
    private readonly shutdownService: ShutdownService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async connect(retry = 0): Promise<void> {
    this.telnet = new Telnet();

    this.telnet.on('connect', this.onConnect.bind(this));
    this.telnet.on('error', this.onError.bind(this));
    this.telnet.on('end', this.onEnd.bind(this));
    this.telnet.on('close', this.onClose.bind(this));
    this.telnet.on('data', this.onData.bind(this));

    try {
      // Check that the socket exists already
      if (!existsSync(this.TELNET_SOCKET_PATH))
        throw new Error('Telnet socket has not yet been created');

      // Attempt connection
      await this.telnet.connect({
        socketConnectOptions: {path: this.TELNET_SOCKET_PATH},
        negotiationMandatory: false,
        echoLines: 2,
      });
    } catch (error) {
      // Connection is retried if it failed
      this.logger.error(error);
      if (retry >= 5) {
        this.logger.error('Failed to establish OpenVPN telnet connection after 5 retries, halting');
        this.shutdownService.shutdown();
        return;
      }
      this.logger.log('Retrying to establish Telnet connection in 1s');
      await setTimeout(1000);
      await this.connect(retry + 1);
    }
  }

  public async disconnect(): Promise<void> {
    await this.telnet?.destroy();
  }

  private onConnect(): void {
    this.eventEmitter.emit(ServerReadyEvent.eventName);
    this.telnet
      ?.send('bytecount 1', {
        ors: '\r\n',
        waitfor: 'SUCCESS: bytecount interval changed',
      })
      .catch((error) => {
        this.logger.error(error);
      });
  }

  private onError(error: Error): void {
    this.logger.log('ERROR');
    this.logger.error(error);
  }

  private onEnd(): void {
    this.logger.log('END');
  }

  private onClose(): void {
    this.logger.log('CLOSE');
  }

  private onData(data: Buffer) {
    const byteCountRegex = /BYTECOUNT:(\d+),(\d+)/;
    const successRegex = /CONNECTED,SUCCESS,([0-9.]+),([0-9.]+),(\d+)/;
    const reconnectingRegex = /RECONNECTING,([a-z-])/;
    const content = data.toString();
    messages.forEach((Message) => {
      if (Message.validate(content))
        this.eventEmitter.emit(Message.eventName, new Message(content));
    });
  }
}
