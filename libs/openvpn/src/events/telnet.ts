import {Client, TelnetEvent} from './abstract';

/** Real-time notification of OpenVPN bandwidth usage. */
export class ByteCountEvent extends TelnetEvent {
  /** @hidden */
  public static readonly startRegex = />BYTECOUNT:(\d+),(\d+)/;
  public static readonly eventName = 'bytecount';

  /** The number of bytes that have been received from the server */
  public readonly bytesIn: number;
  /** the number of bytes that have been sent to the server. */
  public readonly bytesOut: number;

  /** @hidden */
  constructor(message: string) {
    super();
    const match = ByteCountEvent.startRegex.exec(message);
    if (!match) throw new Error('Cloud not find ByteCount information in message');
    this.bytesIn = parseInt(match[1], 10);
    this.bytesOut = parseInt(match[2], 10);
  }
}

/** Real-time notification of OpenVPN bandwidth usage. */
export class ClientByteCountEvent extends TelnetEvent {
  /** @hidden */
  public static readonly startRegex = />BYTECOUNT_CLI:(\d+),(\d+),(\d+)/;
  public static readonly eventName = 'bytecount-cli';

  /** The client ID */
  public readonly cid: string;
  /** The number of bytes that have been received from the server */
  public readonly bytesIn: number;
  /** the number of bytes that have been sent to the server. */
  public readonly bytesOut: number;

  /** @hidden */
  constructor(message: string) {
    super();
    const match = ClientByteCountEvent.startRegex.exec(message);
    if (!match) throw new Error('Cloud not find ByteCount information in message');
    this.cid = match[1];
    this.bytesIn = parseInt(match[2], 10);
    this.bytesOut = parseInt(match[3], 10);
  }
}

/** Notify new client connection ("CONNECT") or existing client TLS session renegotiation ("REAUTH") */
export class ClientConnectEvent extends TelnetEvent {
  /** @hidden */
  public static readonly startRegex = />CLIENT:(CONNECT|REAUTH),(\d+),(\d+)/;
  /** @hidden */
  public static readonly endRegex = />CLIENT:ENV,END/;
  public static readonly eventName = 'client-connect';
  /** @hidden */
  public static readonly commonNameRegex = />CLIENT:ENV,common_name=(.+)/;

  public readonly client: Client;
  public readonly type: 'CONNECT' | 'REAUTH';

  /** @hidden */
  constructor(message: string) {
    super();
    const headerMatch = ClientConnectEvent.startRegex.exec(message);
    if (!headerMatch) throw new Error('Could not find header in message');
    this.type = headerMatch[1] === 'CONNECT' ? 'CONNECT' : 'REAUTH';
    const cid = headerMatch[2];
    const kid = headerMatch[3];
    const commonNameMatch = ClientConnectEvent.commonNameRegex.exec(message);
    if (!commonNameMatch) throw new Error('Could not find client certificate common name');
    const commonName = commonNameMatch[1];
    this.client = new Client({kid, cid, commonName});
  }
}

/** Notify existing client disconnection. */
export class ClientDisconnectEvent extends TelnetEvent {
  /** @hidden */
  public static readonly startRegex = />CLIENT:DISCONNECT,(\d+)/;
  /** @hidden */
  public static readonly endRegex = />CLIENT:ENV,END/;
  public static readonly eventName = 'client-disconnect';

  public readonly cid: string;

  /** @hidden */
  constructor(message: string) {
    super();
    const match = ClientDisconnectEvent.startRegex.exec(message);
    if (!match) throw new Error('Could not parse message');
    this.cid = match[1];
  }
}

/** Notify that a particular virtual address or subnet is now associated with a specific client */
export class ClientAddressEvent extends TelnetEvent {
  /** @hidden */
  public static readonly startRegex = />CLIENT:ADDRESS,(\d+),([0-9a-f:.]+),1/;
  /** @hidden */
  public static readonly endRegex = />CLIENT:ENV,END/;
  public static readonly eventName = 'client-address';

  public readonly cid: string;
  public readonly address: string;

  /** @hidden */
  constructor(message: string) {
    super();
    const match = ClientAddressEvent.startRegex.exec(message);
    if (!match) throw new Error('Could not parse message');
    this.cid = match[1];
    this.address = match[2];
  }
}
