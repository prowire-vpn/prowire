import {Server} from 'server/domain';

export class ServerDto {
  public name: string;
  public connected: boolean;
  public active: boolean;
  public ip: string;
  public port: number;

  public constructor(server: Server) {
    this.name = server.name;
    this.connected = server.connected;
    this.active = server.active;
    this.ip = server.ip;
    this.port = server.port;
  }
}

export class FindServerResponseBodyDto {
  public servers: ServerDto[];

  public constructor(servers: Server[]) {
    this.servers = servers.map((server) => new ServerDto(server));
  }
}
