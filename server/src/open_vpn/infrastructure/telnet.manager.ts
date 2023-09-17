import {Injectable, Logger} from '@nestjs/common';
import {Telnet, SendOptions} from 'telnet-client';
import {setTimeout} from 'timers/promises';
import {existsSync} from 'fs';
import {ShutdownService} from 'lifecycle';
import {messages, ServerReadyEvent} from './telnet.message';
import {EventEmitter2} from '@nestjs/event-emitter';
import {Client} from 'open_vpn/domain/client.entity';

@Injectable()
export class TelnetManager {
  private telnet?: Telnet;
  public readonly TELNET_SOCKET_PATH = '/tmp/prowire-openvpn';

  private readonly logger = new Logger(TelnetManager.name);

  private BufferedMessage?: (typeof messages)[number];
  private bufferedMessageContent: Array<string> = [];

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

  public async authorizeClient(client: Client): Promise<void> {
    await this.send(`client-auth ${client.cid} ${client.kid}\nEND`);
  }

  private send(command: string, options?: SendOptions): Promise<string> {
    return new Promise((resolve, reject) => {
      this.telnet
        ?.send(command, {
          ors: '\r\n',
          waitfor: 'SUCCESS: ',
          ...options,
        })
        .then(resolve)
        .catch(reject);
    });
  }

  private async onConnect(): Promise<void> {
    this.eventEmitter.emit(ServerReadyEvent.eventName);
    await this.send('bytecount 10', {waitFor: 'SUCCESS: bytecount interval changed'});
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
    const content = data.toString();
    this.logger.verbose('Received message from OpenVPN server', content);

    // If we are currently buffering a message, we need to check if the new data completes it
    if (this.BufferedMessage) {
      this.bufferedMessageContent.push(content);
      if (this.BufferedMessage.findEnd(content)) {
        this.eventEmitter.emit(
          this.BufferedMessage.eventName,
          new this.BufferedMessage(this.bufferedMessageContent.join('\n')),
        );
        this.BufferedMessage = undefined;
        this.bufferedMessageContent = [];
      }
      return;
    }

    for (const Message of messages) {
      if (Message.findStart(content)) {
        // When the message is always expected to be a single line, we can build it immediately
        if (Message.findEnd(content))
          return this.eventEmitter.emit(Message.eventName, new Message(content));

        // When the message is expected to be multiple lines, we need to wait for the end
        this.BufferedMessage = Message;
        this.bufferedMessageContent = [content];
      }
    }
  }
}
