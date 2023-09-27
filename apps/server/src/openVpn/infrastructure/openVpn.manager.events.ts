import {Client} from 'openVpn/domain/client.entity';
import * as OpenVpn from '@prowire-vpn/openvpn';

export class ServerReadyEvent {
  public static readonly eventName = OpenVpn.VpnReadyEvent.eventName;
}

export class ServerStopEvent {
  public static readonly eventName = OpenVpn.VpnStopEvent.eventName;
}

export class ByteCountEvent {
  public static readonly eventName = OpenVpn.ByteCountEvent.eventName;
  public readonly bytesIn: number;
  public readonly bytesOut: number;

  constructor(event: OpenVpn.ByteCountEvent) {
    this.bytesIn = event.bytesIn;
    this.bytesOut = event.bytesOut;
  }
}

export class ClientByteCountEvent {
  public static readonly eventName = OpenVpn.ClientByteCountEvent.eventName;
  public readonly cid: string;
  public readonly bytesIn: number;
  public readonly bytesOut: number;

  constructor(event: OpenVpn.ClientByteCountEvent) {
    this.cid = event.cid;
    this.bytesIn = event.bytesIn;
    this.bytesOut = event.bytesOut;
  }
}

export class ClientConnectEvent {
  public static readonly eventName = OpenVpn.ClientConnectEvent.eventName;
  public readonly client: Client;
  public readonly type: 'CONNECT' | 'REAUTH';

  constructor(event: OpenVpn.ClientConnectEvent) {
    this.type = event.type;
    const {cid, kid, commonName} = event.client;
    this.client = new Client({cid, kid, userId: commonName});
  }
}

export class ClientDisconnectEvent {
  public static readonly eventName = OpenVpn.ClientDisconnectEvent.eventName;
  public readonly cid: string;

  constructor(event: OpenVpn.ClientDisconnectEvent) {
    this.cid = event.cid;
  }
}

export class ClientAddressEvent {
  public static readonly eventName = OpenVpn.ClientAddressEvent.eventName;
  public readonly cid: string;
  public readonly address: string;

  constructor(event: OpenVpn.ClientAddressEvent) {
    this.cid = event.cid;
    this.address = event.address;
  }
}
