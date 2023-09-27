import {Injectable, type OnModuleDestroy} from '@nestjs/common';

import {
  ServerStopEvent,
  ServerReadyEvent,
  ClientConnectEvent,
  ClientDisconnectEvent,
  ClientAddressEvent,
  ByteCountEvent,
  ClientByteCountEvent,
} from './openVpn.manager.events';
import {EventEmitter2} from '@nestjs/event-emitter';
import * as OpenVpn from '@prowire-vpn/openvpn';

@Injectable()
export class OpenVpnManager implements OnModuleDestroy {
  constructor(private readonly eventEmitter: EventEmitter2) {
    OpenVpn.on(OpenVpn.VpnReadyEvent.eventName, () => {
      this.eventEmitter.emit(ServerReadyEvent.eventName, new ServerReadyEvent());
    });
    OpenVpn.on(OpenVpn.VpnStopEvent.eventName, () => {
      this.eventEmitter.emit(ServerStopEvent.eventName, new ServerStopEvent());
    });
    OpenVpn.on(OpenVpn.ClientConnectEvent.eventName, (event) => {
      this.eventEmitter.emit(ClientConnectEvent.eventName, new ClientConnectEvent(event));
    });
    OpenVpn.on(OpenVpn.ClientDisconnectEvent.eventName, (event) => {
      this.eventEmitter.emit(ClientDisconnectEvent.eventName, new ClientDisconnectEvent(event));
    });
    OpenVpn.on(OpenVpn.ClientAddressEvent.eventName, (event) => {
      this.eventEmitter.emit(ClientAddressEvent.eventName, new ClientAddressEvent(event));
    });
    OpenVpn.on(OpenVpn.ByteCountEvent.eventName, (event) => {
      this.eventEmitter.emit(ByteCountEvent.eventName, new ByteCountEvent(event));
    });
    OpenVpn.on(OpenVpn.ClientByteCountEvent.eventName, (event) => {
      this.eventEmitter.emit(ClientByteCountEvent.eventName, new ClientByteCountEvent(event));
    });
  }

  public start(config: OpenVpn.OpenVpnConfig) {
    return OpenVpn.start(config);
  }

  public async onModuleDestroy() {
    await OpenVpn.stop();
  }
}
