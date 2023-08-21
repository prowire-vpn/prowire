export class ServerReadyEvent {
  public static readonly eventName = 'server-ready';
}

export class ServerStopEvent {
  public static readonly eventName = 'server-stop';
}

export abstract class TelnetMessage {
  public static readonly regex: RegExp;
  public static readonly eventName: string;

  public static validate(message: string): boolean {
    return this.regex.test(message);
  }

  protected match(message: string): RegExpExecArray {
    const match = (<typeof TelnetMessage>this.constructor).regex.exec(message);
    if (!match) throw new Error('Invalid message received');
    return match;
  }
}

export class ByteCountMessage extends TelnetMessage {
  public static readonly regex = /BYTECOUNT:(\d+),(\d+)/;
  public static readonly eventName = 'bytecount';

  public readonly bytesIn: number;
  public readonly bytesOut: number;

  constructor(message: string) {
    super();
    const match = this.match(message);
    this.bytesIn = parseInt(match[1], 10);
    this.bytesOut = parseInt(match[2], 10);
  }
}

export const messages = [ByteCountMessage];
