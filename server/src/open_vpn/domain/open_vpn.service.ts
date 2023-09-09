import {ConfigService} from '@nestjs/config';
import {Injectable, Logger} from '@nestjs/common';
import {OnEvent, EventEmitter2} from '@nestjs/event-emitter';
import {ProcessManager} from 'open_vpn/infrastructure';
import {OpenVpnConfig} from './open_vpn_config.entity';
import {UpdateOpenVpnOptions} from './open_vpn.service.interface';
import {PkiService} from 'server/domain';
import {ApiGatewayConnected} from 'server/presentation/api.gateway.event';
import {ServerReadyEvent} from 'open_vpn/infrastructure/telnet.message';

@Injectable()
export class OpenVpnService {
  private readonly logger = new Logger(OpenVpnService.name);

  public constructor(
    private readonly configService: ConfigService,
    private readonly processManager: ProcessManager,
    private readonly pkiService: PkiService,
    private readonly eventEmitter: EventEmitter2,
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
  onApiConnection(): void {
    if (this.processManager.isRunning())
      this.eventEmitter.emit(ServerReadyEvent.eventName, new ServerReadyEvent());
  }

  public stop(): void {
    this.processManager.stop();
  }
}
