import {ServerConnectedData} from './server.service';

export class ServerHealthyEvent {
  public static readonly namespace = 'server.healthy';
  constructor(public readonly name: string) {}
}

export class ServerConnectedEvent {
  public static readonly namespace = 'server.connected';
  constructor(public readonly data: ServerConnectedData) {}
}

export class ServerDisconnectedEvent {
  public static readonly namespace = 'server.disconnected';
  constructor(public readonly name: string) {}
}
