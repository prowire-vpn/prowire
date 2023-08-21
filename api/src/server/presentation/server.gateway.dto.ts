import {VpnConfig} from 'server/domain';
import {serialize} from 'bson';

export abstract class WebSocketMessage {
  public readonly type: string;
  public readonly payload: unknown;

  constructor(type: string, payload: unknown) {
    this.type = type;
    this.payload = payload;
  }

  serialize(): Buffer {
    return serialize({type: this.type, payload: this.payload});
  }
}

class StartServerEventPayload {
  public readonly certificate: string;
  public readonly ca: string;
  public readonly routes: Array<string>;
  public readonly subnet: string;

  constructor(config: VpnConfig, certificate: string, ca: string) {
    this.certificate = certificate;
    this.ca = ca;
    this.routes = config.routes.map((route) => route.toIpWithMask());
    this.subnet = config.subnet.toIpWithMask();
  }
}

export class StartServerEvent extends WebSocketMessage {
  public readonly type = 'start';
  public readonly payload!: StartServerEventPayload;

  constructor(config: VpnConfig, certificate: string, ca: string) {
    super('start', new StartServerEventPayload(config, certificate, ca));
  }

  serialize(): Buffer {
    return serialize({
      type: this.type,
      payload: {
        routes: this.payload.routes,
        subnet: this.payload.subnet,
        ca: this.payload.ca,
        certificate: this.payload.certificate,
      },
    });
  }
}

export class StopServerEvent extends WebSocketMessage {
  public readonly type = 'stop';
  constructor() {
    super('stop', undefined);
  }
}
