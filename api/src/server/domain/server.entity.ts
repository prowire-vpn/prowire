export type ServerConstructor = Pick<
  Server,
  'name' | 'connected' | 'active' | 'ip' | 'port' | 'publicKey'
>;

export class Server {
  public name: string;
  public connected: boolean;
  public active: boolean;
  public ip: string;
  public port: number;
  public publicKey: string;

  constructor(init: ServerConstructor) {
    this.name = init.name;
    this.connected = init.connected;
    this.active = init.active;
    this.ip = init.ip;
    this.port = init.port;
    this.publicKey = init.publicKey;
  }
}
