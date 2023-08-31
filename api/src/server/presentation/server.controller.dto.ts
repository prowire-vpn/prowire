import {Server} from 'server/domain';
import {VpnConfig} from 'server/domain';
import {IsString} from 'class-validator';

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

export class ConnectServerRequestBodyDto {
  @IsString()
  publicKey!: string;
}

class ConnectableServerDto {
  public ip: string;
  public port: number;

  public constructor(server: Server) {
    this.ip = server.ip;
    this.port = server.port;
  }
}

export class ConnectServerResponseBodyDto {
  public protocol: string;
  public mode: string;
  public servers: ConnectableServerDto[];

  public constructor(
    servers: Server[],
    config: VpnConfig,
    public ca: string,
    public certificate: string,
  ) {
    this.protocol = config.protocol;
    this.mode = config.mode;
    this.servers = servers.map((server) => new ConnectableServerDto(server));
  }
}
