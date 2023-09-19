import {ServerGateway} from './server.gateway';
import {VpnClientSessionService} from 'server/domain/clientSession.service';

import {
  ClientConnectMessage,
  ClientAuthorizeMessage,
  ClientDisconnectedMessage,
  ClientAddressAssignedMessage,
} from './server.gateway.dto';
import {Injectable, Logger} from '@nestjs/common';

@Injectable()
export class VpnClientSessionMessenger {
  private readonly logger = new Logger(VpnClientSessionMessenger.name);

  constructor(
    private readonly serverGateway: ServerGateway,
    private readonly clientSessionService: VpnClientSessionService,
  ) {
    this.serverGateway.registerHandler(
      ClientConnectMessage.type,
      this.handleClientConnectMessage.bind(this),
    );
    this.serverGateway.registerHandler(
      ClientDisconnectedMessage.type,
      this.handleClientDisconnectedMessage.bind(this),
    );
    this.serverGateway.registerHandler(
      ClientAddressAssignedMessage.type,
      this.handleClientAddressAssignedMessage.bind(this),
    );
  }

  /** The server informs us that a use is attempting to connect */
  private async handleClientConnectMessage(serverId: string, payload: unknown): Promise<void> {
    const sessionId = payload as ClientConnectMessage['payload'];
    const session = await this.clientSessionService.connect(serverId, sessionId);
    this.serverGateway.sendMessage(serverId, new ClientAuthorizeMessage(session.id));
    this.logger.log(
      `Client connected to VPN: [id: ${session.id}, userId: ${session.userId}, serverId: ${serverId}]`,
    );
  }

  /** The server informs us that a user has disconnected */
  public async handleClientDisconnectedMessage(serverId: string, payload: unknown): Promise<void> {
    const {sessionId} = payload as ClientDisconnectedMessage['payload'];
    const session = await this.clientSessionService.disconnect(sessionId);
    this.logger.log(
      `Client disconnected from VPN: [id: ${session.id}, userId: ${session.userId}, serverId: ${serverId}]`,
    );
  }

  /** The server informs us that a user has been assigned an IP address */
  public async handleClientAddressAssignedMessage(
    serverId: string,
    payload: unknown,
  ): Promise<void> {
    const {sessionId, address} = payload as ClientAddressAssignedMessage['payload'];
    const session = await this.clientSessionService.assignAddress(sessionId, address);
    this.logger.log(
      `Client assigned VPN address: ${address} [id: ${session.id}, userId: ${session.userId}, serverId: ${serverId}]`,
    );
  }
}
