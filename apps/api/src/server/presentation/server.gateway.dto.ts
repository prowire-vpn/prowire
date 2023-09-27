import {VpnConfig} from 'server/domain/vpnConfig.entity';
import {serialize} from 'bson';

export abstract class WebSocketMessage<T = undefined> {
  public readonly type: string;
  public readonly payload: T;

  constructor(type: string, payload: T) {
    this.type = type;
    this.payload = payload;
  }

  public serialize(): Buffer {
    return serialize({type: this.type, payload: this.payload});
  }
}

class StartServerMessagePayload {
  public readonly certificate: string;
  public readonly ca: string;
  public readonly protocol: string;
  public readonly mode: string;
  public readonly routes: Array<string>;
  public readonly subnet: string;

  constructor(config: VpnConfig, certificate: string, ca: string) {
    this.certificate = certificate;
    this.ca = ca;
    this.protocol = config.protocol;
    this.mode = config.mode;
    this.routes = config.routes.map((route) => route.toIpWithMask());
    this.subnet = config.subnet.toIpWithMask();
  }

  toJSON() {
    return {
      protocol: this.protocol,
      mode: this.mode,
      routes: this.routes,
      subnet: this.subnet,
      ca: this.ca,
      certificate: this.certificate,
    };
  }
}

export class StartServerMessage extends WebSocketMessage<StartServerMessagePayload> {
  public static readonly type = 'start';

  constructor(config: VpnConfig, certificate: string, ca: string) {
    super(StartServerMessage.type, new StartServerMessagePayload(config, certificate, ca));
  }

  serialize(): Buffer {
    return serialize({
      type: this.type,
      payload: this.payload.toJSON(),
    });
  }
}

export class StopServerMessage extends WebSocketMessage {
  public static readonly type = 'stop';
  constructor() {
    super(StopServerMessage.type, undefined);
  }
}

export class ServerReadyMessage extends WebSocketMessage {
  public static readonly type = 'server-ready';
  constructor() {
    super(ServerReadyMessage.type, undefined);
  }
}

export class ServerStoppedMessage extends WebSocketMessage {
  public static readonly type = 'server-stopped';
  constructor() {
    super(ServerStoppedMessage.type, undefined);
  }
}

export class ClientConnectMessage extends WebSocketMessage<string> {
  public static readonly type = 'client-connect';

  constructor(sessionId: string) {
    super(ClientConnectMessage.type, sessionId);
  }
}

class ClientAuthorizeMessagePayload {
  sessionId: string;

  constructor(sessionId: string) {
    this.sessionId = sessionId;
  }
}

export class ClientAuthorizeMessage extends WebSocketMessage<ClientAuthorizeMessagePayload> {
  public static readonly type = 'client-authorize';

  constructor(sessionId: string) {
    super(ClientConnectMessage.type, new ClientAuthorizeMessagePayload(sessionId));
  }
}

class ClientDisconnectedMessagePayload {
  sessionId: string;

  constructor(sessionId: string) {
    this.sessionId = sessionId;
  }
}

export class ClientDisconnectedMessage extends WebSocketMessage<ClientDisconnectedMessagePayload> {
  public static readonly type = 'client-disconnected';

  constructor(sessionId: string) {
    super(ClientDisconnectedMessage.type, new ClientDisconnectedMessagePayload(sessionId));
  }
}

class ClientAddressAssignedMessagePayload {
  sessionId: string;
  address: string;

  constructor(sessionId: string, address: string) {
    this.sessionId = sessionId;
    this.address = address;
  }
}

export class ClientAddressAssignedMessage extends WebSocketMessage<ClientAddressAssignedMessagePayload> {
  public static readonly type = 'client-address-assigned';

  constructor(userId: string, address: string) {
    super(
      ClientAddressAssignedMessage.type,
      new ClientAddressAssignedMessagePayload(userId, address),
    );
  }
}
