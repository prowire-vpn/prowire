import {ConfigService} from '@nestjs/config';
import {Injectable, Logger} from '@nestjs/common';
import {OnEvent, EventEmitter2} from '@nestjs/event-emitter';
import {ProcessManager, TelnetManager} from 'openVpn/infrastructure';
import {OpenVpnConfig} from './openVpnConfig.entity';
import {UpdateOpenVpnOptions} from './openVpn.service.interface';
import {PkiService} from 'server/domain';
import {ApiGatewayConnected} from 'server/presentation/api.gateway.event';
import {
  ServerReadyEvent,
  ByteCountEvent,
  ClientByteCountEvent,
} from 'openVpn/infrastructure/telnet.message';
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

  public clientConnected(client: Client): void {
    this.logger.log(`Client connected [cid: ${client.cid}, userId: ${client.userId}]`);
    this.telnetManager.authorizeClient(client);
  }

  public clientDisconnected(cid: string): Client {
    this.logger.log(`Client disconnected [cid: ${cid}]`);
    const client = Client.getByCid(cid);
    if (!client) throw new Error(`Client with cid ${cid} not found after disconnect`);
    Client.removeByCid(cid);
    return client;
  }

  @OnEvent(ByteCountEvent.eventName)
  private onByteCount(event: ByteCountEvent): void {
    this.logger.debug(`Received global byte count [in: ${event.bytesIn}, out: ${event.bytesOut}`);
  }

  @OnEvent(ClientByteCountEvent.eventName)
  private onClientByteCount(event: ClientByteCountEvent): void {
    this.logger.debug(
      `Received client byte count [cid: ${event.cid}, in: ${event.bytesIn}, out: ${event.bytesOut}`,
    );
  }

  public clientAddressAssigned(cid: string, address: string): Client {
    const client = Client.getByCid(cid);
    if (!client) throw new Error(`Client with cid ${cid} not found after disconnect`);
    client.assignAddress(address);
    this.logger.debug(`Address assigned to client [cid: ${cid}, address: ${address}`);
    return client;
  }

  public stop(): void {
    this.processManager.stop();
  }
}
