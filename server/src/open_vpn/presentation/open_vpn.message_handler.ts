import {Injectable} from '@nestjs/common';
import {MessageService} from 'server/domain';
import {StartServerEvent} from '@prowire-vpn/api';
import {OpenVpnService} from 'open_vpn/domain';

@Injectable()
export class OpenVpnMessageHandler {
  constructor(
    private readonly messageService: MessageService,
    private readonly openVpnService: OpenVpnService,
  ) {
    this.messageService.registerHandler('start', this.start.bind(this));
    this.messageService.registerHandler('stop', this.stop.bind(this));
  }

  /** Message from the API requesting a server start */
  start(payload: unknown): void {
    this.openVpnService.update(payload as StartServerEvent['payload']);
  }

  stop(): void {
    this.openVpnService.stop();
  }
}
