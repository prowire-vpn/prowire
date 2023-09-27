export class Client {
  /** Key ID, numerical ID for the key associated with a given client TLS session, sequence = 0,1,2,... */
  public kid: string;
  /** Client ID, numerical ID for each connecting client, sequence = 0,1,2,... */
  public cid: string;
  /** Common name of the client certificate */
  public commonName: string;

  constructor(data: {kid: string; cid: string; commonName: string}) {
    this.kid = data.kid;
    this.cid = data.cid;
    this.commonName = data.commonName;
  }
}

export abstract class Event<T extends typeof Event = typeof Event> {
  public static readonly eventName: string;
  public readonly eventName: string;

  /** @hidden */
  constructor() {
    this.eventName = (this.constructor as T).eventName;
  }
}

export abstract class TelnetEvent extends Event {
  /** @hidden */
  public static readonly startRegex: RegExp;
  /** @hidden */
  public static readonly endRegex?: RegExp;
  public static readonly eventName: string;

  /** @hidden */
  public static findStart(message: string): boolean {
    return this.startRegex.test(message);
  }

  /** @hidden */
  public static findEnd(message: string): boolean {
    if (!this.endRegex) return true;
    return this.endRegex.test(message);
  }
}
