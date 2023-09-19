import {VpnClientSession} from 'server/domain/clientSession.entity';
import {IResult} from 'ua-parser-js';

export class VpnClientSessionDto {
  id: string;
  userId: string;
  device: IResult;
  connectingAddress: string;
  createdAt: string;
  connectedAt?: string;
  addressAssignedAt?: string;
  disconnectedAt?: string;
  serverId?: string;
  assignedAddress?: string;
  bytesIn?: number;
  bytesOut?: number;

  constructor(session: VpnClientSession) {
    this.id = session.id;
    this.userId = session.userId;
    this.device = session.device;
    this.connectingAddress = session.connectingAddress;
    this.createdAt = session.createdAt.toISOString();
    this.connectedAt = session.connectedAt?.toISOString();
    this.addressAssignedAt = session.addressAssignedAt?.toISOString();
    this.disconnectedAt = session.disconnectedAt?.toISOString();
    this.serverId = session.serverId;
    this.assignedAddress = session.assignedAddress;
    this.bytesIn = session.bytesIn;
    this.bytesOut = session.bytesOut;
  }
}

export class ListUserClientSessionResponseBodyDto {
  public sessions: Array<VpnClientSessionDto>;
  public total: number;

  constructor({sessions, total}: {sessions: VpnClientSession[]; total: number}) {
    this.sessions = sessions.map((session) => new VpnClientSessionDto(session));
    this.total = total;
  }
}
