export interface ClientConstructorOptions {
  kid: string;
  cid: string;
  userId: string;
}

export class Client {
  public readonly kid: string;
  public readonly cid: string;
  public readonly userId: string;
  public readonly connectedAt = new Date();
  public bytesIn = 0;
  public bytesOut = 0;
  public address?: string;
  public static clients: Array<Client> = [];

  constructor(data: ClientConstructorOptions) {
    this.kid = data.kid;
    this.cid = data.cid;
    this.userId = data.userId;
    this.connectedAt = new Date();
    Client.addClient(this);
  }

  private static addClient(client: Client): void {
    Client.clients.push(client);
  }

  public static removeClientByCid(cid: string): void {
    Client.clients = Client.clients.filter((client) => client.cid !== cid);
  }

  public static updateByteCount(cid: string, bytesIn: number, bytesOut: number): Client {
    const client = Client.clients.find((client) => client.cid === cid);
    if (!client) throw new Error(`Client with cid ${cid} not found`);
    client.bytesIn = bytesIn;
    client.bytesOut = bytesOut;
    return client;
  }

  public static updateAddress(cid: string, address: string): Client {
    const client = Client.clients.find((client) => client.cid === cid);
    if (!client) throw new Error(`Client with cid ${cid} not found`);
    client.address = address;
    return client;
  }
}
