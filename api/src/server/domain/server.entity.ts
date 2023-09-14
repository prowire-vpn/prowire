export type ServerConstructor = Pick<
  Server,
  | 'name'
  | 'connected'
  | 'active'
  | 'ip'
  | 'port'
  | 'publicKey'
  | 'connectedAt'
  | 'lastSeenAt'
  | 'disconnectedAt'
>;

export class Server {
  public name: string;
  public connected: boolean;
  public connectedAt?: Date;
  public lastSeenAt?: Date;
  public disconnectedAt?: Date;
  public active: boolean;
  public ip: string;
  public port: number;
  public publicKey: string;

  constructor(init: ServerConstructor) {
    this.name = init.name;
    this.connected = init.connected;
    this.connectedAt = init.connectedAt;
    this.lastSeenAt = init.lastSeenAt;
    this.disconnectedAt = init.disconnectedAt;
    this.active = init.active;
    this.ip = init.ip;
    this.port = init.port;
    this.publicKey = init.publicKey;
  }

  public disconnected() {
    this.active = false;
    this.connected = false;
    this.connectedAt = undefined;
    this.lastSeenAt = undefined;
    this.disconnectedAt = new Date();
  }

  public healthy() {
    this.lastSeenAt = new Date();
  }
}
