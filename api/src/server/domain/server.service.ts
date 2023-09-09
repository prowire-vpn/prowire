import {Injectable, Inject, forwardRef} from '@nestjs/common';
import {ServerRepository} from 'server/infrastructure/server.repository';
import {Server, ServerConstructor} from './server.entity';
import {ServerNotFoundError} from './server.service.error';
import {PkiService} from './pki.service';
import {VpnConfigService} from './vpnConfig.service';
import {ServerGateway} from 'server/presentation/server.gateway';

@Injectable()
export class ServerService {
  constructor(
    private serverRepository: ServerRepository,
    private pkiService: PkiService,
    private vpnConfigService: VpnConfigService,
    @Inject(forwardRef(() => ServerGateway)) private serverGateway: ServerGateway,
  ) {}

  public async connected(data: Omit<ServerConstructor, 'connected' | 'active'>): Promise<Server> {
    const server = new Server({...data, connected: true, active: false});
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

  public async stopped(name: string): Promise<Server> {
    const server = await this.serverRepository.get(name);
    if (!server) throw new ServerNotFoundError(name);
    server.active = false;
    return await this.serverRepository.persist(server);
  }

  public async disconnected(name: string): Promise<Server> {
    const server = await this.serverRepository.get(name);
    if (!server) throw new ServerNotFoundError(name);
    server.connected = false;
    server.active = false;
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
}
