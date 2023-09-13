import {Injectable, Inject, forwardRef} from '@nestjs/common';
import {ServerRepository} from 'server/infrastructure/server.repository';
import {Server, ServerConstructor} from './server.entity';
import {ServerNotFoundError} from './server.service.error';
import {PkiService} from './pki.service';
import {VpnConfigService} from './vpnConfig.service';
import {ServerGateway} from 'server/presentation/server.gateway';
import {Interval} from '@nestjs/schedule';
import {LeaderService} from 'leader/domain';
import {isBefore, subSeconds} from 'date-fns';

@Injectable()
export class ServerService {
  constructor(
    private readonly serverRepository: ServerRepository,
    private readonly pkiService: PkiService,
    private readonly vpnConfigService: VpnConfigService,
    @Inject(forwardRef(() => ServerGateway)) private readonly serverGateway: ServerGateway,
    private readonly leaderService: LeaderService,
  ) {}

  public async connected(data: Omit<ServerConstructor, 'connected' | 'active'>): Promise<Server> {
    const server = new Server({...data, connected: true, active: false, connectedAt: new Date()});
    server.healthy();
    await this.serverRepository.persist(server);
    await this.start(server);
    return server;
  }

  public async ready(name: string): Promise<Server> {
    const server = await this.serverRepository.get(name);
    if (!server) throw new ServerNotFoundError(name);
    server.active = true;
    return await this.serverRepository.persist(server);
  }

  public async healthy(name: string): Promise<Server> {
    const server = await this.serverRepository.get(name);
    if (!server) throw new ServerNotFoundError(name);
    server.healthy();
    return await this.serverRepository.persist(server);
  }

  public async stopped(name: string): Promise<Server> {
    const server = await this.serverRepository.get(name);
    if (!server) throw new ServerNotFoundError(name);
    server.active = false;
    return await this.serverRepository.persist(server);
  }

  public async disconnected(name: string): Promise<Server> {
    const server = await this.serverRepository.get(name);
    if (!server) throw new ServerNotFoundError(name);
    server.disconnected();
    return this.serverRepository.persist(server);
  }

  public async get(name: string): Promise<Server> {
    const server = await this.serverRepository.get(name);
    if (!server) throw new ServerNotFoundError(name);
    return server;
  }

  public async find(): Promise<Server[]> {
    return await this.serverRepository.find();
  }

  public async start(server: Server): Promise<void> {
    const vpnConfig = await this.vpnConfigService.get();
    const {certificate, ca} = await this.pkiService.generateCertificate(
      server.publicKey,
      server.name,
      {server: true},
    );
    this.serverGateway.sendStartMessage(server, vpnConfig, certificate, ca);
  }

  @Interval(1_000)
  private async checkHealth() {
    if (!this.leaderService.isLeader) return;
    const servers = await this.serverRepository.find({connected: true});
    const now = new Date();
    const unhealthy: Array<Server> = [];
    for (const server of servers) {
      if (!server.lastSeenAt || isBefore(server.lastSeenAt, subSeconds(now, 5))) {
        unhealthy.push(server);
      }
    }

    await Promise.all(
      unhealthy.map((server) => {
        server.disconnected();
        return this.serverRepository.persist(server);
      }),
    );
  }
}
