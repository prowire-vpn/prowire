import {Injectable, Logger} from '@nestjs/common';
import {
  StartServerMessage,
  StopServerMessage,
  ServerReadyMessage,
  ServerStoppedMessage,
  ClientConnectMessage,
  ClientDisconnectedMessage,
  ClientAddressAssignedMessage,
} from '@prowire-vpn/api';
import {OpenVpnService} from 'openVpn/domain/openVpn.service';
import {OnEvent} from '@nestjs/event-emitter';
import {
  ServerReadyEvent,
  ServerStopEvent,
  ClientConnectEvent,
  ClientDisconnectEvent,
  ClientAddressEvent,
} from 'openVpn/infrastructure';
import {ApiGateway} from 'server/presentation';

@Injectable()
export class OpenVpnMessenger {
  private readonly logger = new Logger(OpenVpnService.name);

  constructor(
    private readonly openVpnService: OpenVpnService,
    private readonly apiGateway: ApiGateway,
  ) {
    this.apiGateway.registerHandler(StartServerMessage.type, this.handleStartMessage.bind(this));
    this.apiGateway.registerHandler(StopServerMessage.type, this.handleStopMessage.bind(this));
  }

  /** Message from the API requesting a server start */
  private handleStartMessage(payload: unknown): void {
    this.openVpnService.update(payload as StartServerMessage['payload']);
  }

  /** Message from the API requesting the server to stop */
  private handleStopMessage(): void {
    this.openVpnService.stop();
  }

  @OnEvent(ServerReadyEvent.eventName)
  private onServerReady(): void {
    this.apiGateway.send(new ServerReadyMessage());
  }

  @OnEvent(ServerStopEvent.eventName)
  private onServerStopped(): void {
    this.apiGateway.send(new ServerStoppedMessage());
  }

  /** Message from OpenVPN, informing that a user attempts to connect */
  @OnEvent(ClientConnectEvent.eventName)
  private onClientConnect(event: ClientConnectEvent): void {
    this.openVpnService.clientConnected(event.client);
    this.apiGateway.send(new ClientConnectMessage(event.client.userId));
  }

  /** Message from OpenVPN, informing that a user disconnected */
  @OnEvent(ClientDisconnectEvent.eventName)
  private onClientDisconnect(event: ClientDisconnectEvent): void {
    const client = this.openVpnService.clientDisconnected(event.cid);
    this.apiGateway.send(new ClientDisconnectedMessage(client.userId));
  }

  /** Message from OpenVPN, informing that a user was assigned an address */
  @OnEvent(ClientAddressEvent.eventName)
  private onClientAddress(event: ClientAddressEvent): void {
    const client = this.openVpnService.clientAddressAssigned(event.cid, event.address);
    if (!client.address) throw new Error(`Client ${client.userId} has no address assigned`);
    this.apiGateway.send(new ClientAddressAssignedMessage(client.userId, client.address));
  }
}
