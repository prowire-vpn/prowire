import {Client} from 'openVpn/domain/client.entity';

export class ServerReadyEvent {
  public static readonly eventName = 'server-ready';
}

export class ServerStopEvent {
  public static readonly eventName = 'server-stop';
}

export abstract class TelnetEvent {
  public static readonly startRegex: RegExp;
  public static readonly endRegex?: RegExp;
  public static readonly eventName: string;

  public static findStart(message: string): boolean {
    return this.startRegex.test(message);
  }

  public static findEnd(message: string): boolean {
    if (!this.endRegex) return true;
    return this.endRegex.test(message);
  }
}

export class ByteCountEvent extends TelnetEvent {
  public static readonly startRegex = />BYTECOUNT:(\d+),(\d+)/;
  public static readonly eventName = 'bytecount';

  public readonly bytesIn: number;
  public readonly bytesOut: number;

  constructor(message: string) {
    super();
    const match = ByteCountEvent.startRegex.exec(message);
    if (!match) throw new Error('Cloud not find ByteCount information in message');
    this.bytesIn = parseInt(match[1], 10);
    this.bytesOut = parseInt(match[2], 10);
  }
}

export class ClientByteCountEvent extends TelnetEvent {
  public static readonly startRegex = />BYTECOUNT_CLI:(\d+),(\d+),(\d+)/;
  public static readonly eventName = 'bytecount-cli';

  public readonly cid: string;
  public readonly bytesIn: number;
  public readonly bytesOut: number;

  constructor(message: string) {
    super();
    const match = ClientByteCountEvent.startRegex.exec(message);
    if (!match) throw new Error('Cloud not find ByteCount information in message');
    this.cid = match[1];
    this.bytesIn = parseInt(match[2], 10);
    this.bytesOut = parseInt(match[3], 10);
  }
}

export class ClientConnectEvent extends TelnetEvent {
  public static readonly startRegex = />CLIENT:(CONNECT|REAUTH),(\d+),(\d+)/;
  public static readonly endRegex = />CLIENT:ENV,END/;
  public static readonly eventName = 'client-connect';
  public static readonly userIdRegex = />CLIENT:ENV,common_name=client:([a-zA-Z0-9]+)/;

  public readonly client: Client;
  public readonly type: 'CONNECT' | 'REAUTH';

  constructor(message: string) {
    super();
    const headerMatch = ClientConnectEvent.startRegex.exec(message);
    if (!headerMatch) throw new Error('Could not find header in message');
    this.type = headerMatch[1] === 'CONNECT' ? 'CONNECT' : 'REAUTH';
    const cid = headerMatch[2];
    const kid = headerMatch[3];
    const userIdMatch = ClientConnectEvent.userIdRegex.exec(message);
    if (!userIdMatch) throw new Error('Could not find userId in message');
    const userId = userIdMatch[1];
    this.client = new Client({kid, cid, userId});
  }
}

export class ClientDisconnectEvent extends TelnetEvent {
  public static readonly startRegex = />CLIENT:DISCONNECT,(\d+)/;
  public static readonly endRegex = />CLIENT:ENV,END/;
  public static readonly eventName = 'client-disconnect';

  public readonly cid: string;

  constructor(message: string) {
    super();
    const match = ClientDisconnectEvent.startRegex.exec(message);
    if (!match) throw new Error('Could not parse message');
    this.cid = match[1];
  }
}

export class ClientAddressEvent extends TelnetEvent {
  public static readonly startRegex = />CLIENT:ADDRESS,(\d+),([0-9a-f:.]+),1/;
  public static readonly endRegex = />CLIENT:ENV,END/;
  public static readonly eventName = 'client-address';

  public readonly cid: string;
  public readonly address: string;

  constructor(message: string) {
    super();
    const match = ClientAddressEvent.startRegex.exec(message);
    if (!match) throw new Error('Could not parse message');
    this.cid = match[1];
    this.address = match[2];
  }
}

export const messages = [
  ByteCountEvent,
  ClientByteCountEvent,
  ClientConnectEvent,
  ClientDisconnectEvent,
  ClientAddressEvent,
];
