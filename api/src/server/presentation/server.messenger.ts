import {ServerGateway} from './server.gateway';
import {ServerService} from 'server/domain/server.service';
import {
  ServerConnectedEvent,
  ServerDisconnectedEvent,
  ServerHealthyEvent,
} from 'server/domain/server.events';
import {ServerReadyMessage, ServerStoppedMessage, StartServerMessage} from './server.gateway.dto';
import {OnEvent} from '@nestjs/event-emitter';
import {Injectable, Logger} from '@nestjs/common';
import {Interval} from '@nestjs/schedule';

@Injectable()
export class ServerMessenger {
  private readonly logger = new Logger(ServerMessenger.name);

  constructor(
    private readonly serverGateway: ServerGateway,
    private readonly serverService: ServerService,
  ) {
    this.serverGateway.registerHandler(ServerReadyMessage.type, this.handleReadyMessage.bind(this));
    this.serverGateway.registerHandler(
      ServerStoppedMessage.type,
      this.handleServerStoppedMessage.bind(this),
    );
  }

  /** The server informs us that it is ready to serve traffic */
  private async handleReadyMessage(serverId: string): Promise<void> {
    await this.serverService.setServerReady(serverId);
  }

  /** The server informs us that it has stopped serving traffic */
  private async handleServerStoppedMessage(serverId: string): Promise<void> {
    await this.serverService.setServerStopped(serverId);
  }

  /** A server has connected to the API */
  @OnEvent(ServerConnectedEvent.namespace)
  private async connected(event: ServerConnectedEvent): Promise<void> {
    const server = await this.serverService.setServerConnected(event.data);
    const {config, ca, certificate} = await this.serverService.getVpnConfig(server);
    this.serverGateway.sendMessage(server.name, new StartServerMessage(config, certificate, ca));
  }

  /** A server has disconnected from the API */
  @OnEvent(ServerDisconnectedEvent.namespace)
  private async disconnected(event: ServerDisconnectedEvent): Promise<void> {
    const server = await this.serverService.get(event.name);
    await this.serverService.setServerDisconnected(server);
  }

  /** A server returned a ping/pong indicating it's healthy */
  @OnEvent(ServerHealthyEvent.namespace)
  private async healthy(event: ServerHealthyEvent): Promise<void> {
    return await this.serverService.setServerHealthy(event.name);
  }

  /**
   * Every second we ensure that there are no unhealthy servers connected
   * A server is considered unhealthy if it did not answer to a ping/pong in the last 5 seconds
   */
  @Interval(1_000)
  private async checkHealth() {
    const unhealthyServers = await this.serverService.getUnhealthyServers();
    for (const server of unhealthyServers) {
      this.serverGateway.disconnectServer(server);
    }
    await Promise.all(
      unhealthyServers.map((server) => this.serverService.setServerDisconnected(server)),
    );
  }
}
