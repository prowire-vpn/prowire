import {ServerGateway} from './server.gateway';
import {ServerService} from 'server/domain/server.service';
import {
  ServerConnectedEvent,
  ServerDisconnectedEvent,
  ServerHealthyEvent,
} from 'server/domain/server.events';
import {
  ServerReadyMessage,
  ServerStoppedMessage,
  ClientConnectMessage,
  ClientAuthorizeMessage,
  ClientDisconnectedMessage,
  ClientAddressAssignedMessage,
  StartServerMessage,
} from './server.gateway.dto';
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
    this.serverGateway.registerHandler(
      ClientConnectMessage.type,
      this.handleClientConnectMessage.bind(this),
    );
    this.serverGateway.registerHandler(
      ClientAddressAssignedMessage.type,
      this.handleClientAddressAssignedMessage.bind(this),
    );
  }

  /** The server informs us that it is ready to serve traffic */
  private async handleReadyMessage(serverName: string): Promise<void> {
    await this.serverService.setServerReady(serverName);
  }

  /** The server informs us that it has stopped serving traffic */
  private async handleServerStoppedMessage(serverName: string): Promise<void> {
    await this.serverService.setServerStopped(serverName);
  }

  /** The server informs us that a use is attempting to connect */
  private handleClientConnectMessage(serverName: string, payload: unknown): void {
    const userId = payload as ClientConnectMessage['payload'];
    this.serverService.connectClient(userId);
    this.serverGateway.sendMessage(serverName, new ClientAuthorizeMessage(userId));
  }

  /** The server informs us that a user has disconnected */
  public async handleClientDisconnectedMessage(
    serverName: string,
    payload: unknown,
  ): Promise<void> {
    const {userId} = payload as ClientDisconnectedMessage['payload'];
    await this.serverService.get(userId);
    this.logger.log(`Client disconnected: ${userId}`);
  }

  /** The server informs us that a user has been assigned an IP address */
  public async handleClientAddressAssignedMessage(
    serverName: string,
    payload: unknown,
  ): Promise<void> {
    const {userId, address} = payload as ClientAddressAssignedMessage['payload'];
    this.logger.log(`Client assigned address: ${userId} ${address}`);
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
