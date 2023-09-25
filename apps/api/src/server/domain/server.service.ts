import {Injectable} from '@nestjs/common';
import {ServerRepository} from 'server/infrastructure/server.repository';
import {Server, type ServerConstructor} from './server.entity';
import {ServerNotFoundError} from './server.service.error';
import {PkiService} from './pki.service';
import {VpnConfigService} from './vpnConfig.service';
import {LeaderService} from 'leader/domain';
import {isBefore, subSeconds} from 'date-fns';
import {VpnConfig} from './vpnConfig.entity';

export type ServerConnectedData = Omit<ServerConstructor, 'connected' | 'active'>;

@Injectable()
export class ServerService {
  constructor(
    private readonly serverRepository: ServerRepository,
    private readonly pkiService: PkiService,
    private readonly vpnConfigService: VpnConfigService,
    private readonly leaderService: LeaderService,
  ) {}

  public async get(name: string): Promise<Server> {
    const server = await this.serverRepository.get(name);
    if (!server) throw new ServerNotFoundError(name);
    return server;
  }

  public async find(): Promise<Server[]> {
    return await this.serverRepository.find();
  }

  public async getVpnConfig(
    server: Server,
  ): Promise<{config: VpnConfig; certificate: string; ca: string}> {
    const config = await this.vpnConfigService.get();
    const {certificate, ca} = await this.pkiService.generateCertificate(
      server.publicKey,
      server.name,
      {server: true},
    );

    return {config, certificate, ca};
  }

  public async getUnhealthyServers(): Promise<Server[]> {
    if (!this.leaderService.isLeader) return [];
    const servers = await this.serverRepository.find({connected: true});
    const now = new Date();
    const unhealthy: Array<Server> = [];
    for (const server of servers) {
      if (!server.lastSeenAt || isBefore(server.lastSeenAt, subSeconds(now, 5))) {
        unhealthy.push(server);
      }
    }
    return unhealthy;
  }

  public async setServerDisconnected(server: Server): Promise<void> {
    server.disconnected();
    await this.serverRepository.persist(server);
  }

  public async setServerHealthy(name: string): Promise<void> {
    const server = await this.get(name);
    server.healthy();
    await this.serverRepository.persist(server);
  }

  public async setServerReady(name: string): Promise<Server> {
    const server = await this.get(name);
    server.ready();
    return await this.serverRepository.persist(server);
  }

  public async setServerStopped(name: string): Promise<Server> {
    const server = await this.get(name);
    server.stopped();
    return await this.serverRepository.persist(server);
  }

  public async setServerConnected(data: ServerConnectedData): Promise<Server> {
    const server = new Server({
      ...data,
      connected: true,
      active: false,
      connectedAt: new Date(),
    });
    server.healthy();
    return await this.serverRepository.persist(server);
  }
}
