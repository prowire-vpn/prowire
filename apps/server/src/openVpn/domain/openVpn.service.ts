import {ConfigService} from '@nestjs/config';
import {Injectable, Logger} from '@nestjs/common';
import {OnEvent, EventEmitter2} from '@nestjs/event-emitter';
import {type UpdateOpenVpnOptions} from './openVpn.service.interface';
import {PkiService} from 'server/domain';
import {ApiGatewayConnected} from 'server/presentation/api.gateway.event';
import {
  ServerReadyEvent,
  ByteCountEvent,
  ClientByteCountEvent,
} from 'openVpn/infrastructure/openVpn.manager.events';
import {OpenVpnManager} from 'openVpn/infrastructure/openVpn.manager';
import {Client} from './client.entity';
import * as OpenVpn from '@prowire-vpn/openvpn';

@Injectable()
export class OpenVpnService {
  private readonly logger = new Logger(OpenVpnService.name);

  public constructor(
    private readonly configService: ConfigService,
    private readonly pkiService: PkiService,
    private readonly eventEmitter: EventEmitter2,
    private readonly openVpnManager: OpenVpnManager,
  ) {}

  /** Update the server configuration */
  public update(update: UpdateOpenVpnOptions): void {
    const openVpnConfig = new OpenVpn.OpenVpnConfig({
      ...update,
      role: 'server',
      key: this.pkiService.getKeyPair().private,
      port: this.configService.getOrThrow<number>('VPN_SERVER_PORT'),
      dhParam: this.configService.getOrThrow<string>('VPN_SERVER_DH_PARAM'),
    });

    // Start the server if not currently running
    if (!OpenVpn.running)
      this.openVpnManager.start(openVpnConfig).catch((error: unknown) => {
        this.logger.error(error);
      });
  }

  @OnEvent(ApiGatewayConnected.eventName)
  private onApiConnection(): void {
    if (OpenVpn.running) this.eventEmitter.emit(ServerReadyEvent.eventName, new ServerReadyEvent());
  }

  public clientConnected(client: Client): void {
    this.logger.log(`Client connected [cid: ${client.cid}, userId: ${client.userId}]`);
    OpenVpn.authorizeClient(client);
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
    OpenVpn.stop();
  }
}
