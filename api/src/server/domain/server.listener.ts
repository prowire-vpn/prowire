import {OnEvent} from '@nestjs/event-emitter';
import {ServerRepository} from 'server/infrastructure';
import {
  ServerConnectedEvent,
  ServerHealthyEvent,
  ServerReadyEvent,
  ServerStoppedEvent,
  ServerDisconnectedEvent,
} from './server.events';
import {Injectable} from '@nestjs/common';
import {Server} from './server.entity';
import {ServerService} from './server.service';

@Injectable()
export class ServerListener {
  constructor(
    private readonly serverRepository: ServerRepository,
    private readonly serverService: ServerService,
  ) {}

  @OnEvent(ServerConnectedEvent.namespace)
  private async connected(event: ServerConnectedEvent): Promise<Server> {
    const server = new Server({
      ...event.data,
      connected: true,
      active: false,
      connectedAt: new Date(),
    });
    server.healthy();
    await this.serverRepository.persist(server);
    await this.serverService.start(server);
    return server;
  }

  @OnEvent(ServerHealthyEvent.namespace)
  private async healthy(event: ServerHealthyEvent): Promise<Server> {
    const server = await this.serverService.get(event.name);
    if (!server.connected) return await this.connected(new ServerConnectedEvent(server));
    server.healthy();
    return await this.serverRepository.persist(server);
  }

  @OnEvent(ServerReadyEvent.namespace)
  private async ready(event: ServerReadyEvent): Promise<Server> {
    const server = await this.serverService.get(event.name);
    server.ready();
    return await this.serverRepository.persist(server);
  }

  @OnEvent(ServerStoppedEvent.namespace)
  private async stopped(event: ServerStoppedEvent): Promise<Server> {
    const server = await this.serverService.get(event.name);
    server.stopped();
    return await this.serverRepository.persist(server);
  }

  @OnEvent(ServerDisconnectedEvent.namespace)
  private async disconnected(event: ServerDisconnectedEvent): Promise<Server> {
    const server = await this.serverService.get(event.name);
    server.disconnected();
    return this.serverRepository.persist(server);
  }
}
