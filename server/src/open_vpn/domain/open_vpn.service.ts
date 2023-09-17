import {ConfigService} from '@nestjs/config';
import {Injectable, Logger} from '@nestjs/common';
import {OnEvent, EventEmitter2} from '@nestjs/event-emitter';
import {ProcessManager, TelnetManager} from 'open_vpn/infrastructure';
import {OpenVpnConfig} from './open_vpn_config.entity';
import {UpdateOpenVpnOptions} from './open_vpn.service.interface';
import {PkiService} from 'server/domain';
import {ApiGatewayConnected} from 'server/presentation/api.gateway.event';
import {
  ServerReadyEvent,
  ClientConnectMessage,
  ClientDisconnectMessage,
  ByteCountMessage,
  ClientByteCountMessage,
  ClientAddressMessage,
} from 'open_vpn/infrastructure/telnet.message';
import {Client} from './client.entity';

@Injectable()
export class OpenVpnService {
  private readonly logger = new Logger(OpenVpnService.name);

  public constructor(
    private readonly configService: ConfigService,
    private readonly processManager: ProcessManager,
    private readonly pkiService: PkiService,
    private readonly eventEmitter: EventEmitter2,
    private readonly telnetManager: TelnetManager,
  ) {}

  /** Update the server configuration */
  public update(update: UpdateOpenVpnOptions): void {
    const openVpnConfig = new OpenVpnConfig({
      ...update,
      key: this.pkiService.getKeyPair().private,
      port: this.configService.getOrThrow<number>('VPN_SERVER_PORT'),
      dhParam: this.configService.getOrThrow<string>('VPN_SERVER_DH_PARAM'),
    });

    // Start the server if not currently running
    if (!this.processManager.isRunning())
      this.processManager.start(openVpnConfig).catch((error: unknown) => {
        this.logger.error(error);
      });
  }

  @OnEvent(ApiGatewayConnected.eventName)
  private onApiConnection(): void {
    if (this.processManager.isRunning())
      this.eventEmitter.emit(ServerReadyEvent.eventName, new ServerReadyEvent());
  }

  @OnEvent(ClientConnectMessage.eventName)
  private onClientConnect(event: ClientConnectMessage): void {
    this.logger.log(`Client connected [cid: ${event.client.cid}, userId: ${event.client.userId}]`);
    this.telnetManager.authorizeClient(event.client);
  }

  @OnEvent(ClientDisconnectMessage.eventName)
  private onClientDisconnect(event: ClientDisconnectMessage): void {
    this.logger.log(`Client disconnected [cid: ${event.cid}]`);
    Client.removeClientByCid(event.cid);
  }

  @OnEvent(ByteCountMessage.eventName)
  private onByteCount(event: ByteCountMessage): void {
    this.logger.debug(`Received global byte count [in: ${event.bytesIn}, out: ${event.bytesOut}`);
  }

  @OnEvent(ClientByteCountMessage.eventName)
  private onClientByteCount(event: ClientByteCountMessage): void {
    this.logger.debug(
      `Received client byte count [cid: ${event.cid}, in: ${event.bytesIn}, out: ${event.bytesOut}`,
    );
  }

  @OnEvent(ClientAddressMessage.eventName)
  private onClientAddress(event: ClientAddressMessage): void {
    Client.updateAddress(event.cid, event.address);
    this.logger.debug(`Address assigned to client [cid: ${event.cid}, address: ${event.address}`);
  }

  public stop(): void {
    this.processManager.stop();
  }
}
