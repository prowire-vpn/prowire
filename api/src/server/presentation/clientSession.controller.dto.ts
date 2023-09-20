import {VpnClientSession} from 'server/domain/clientSession.entity';
import {IResult} from 'ua-parser-js';

export class VpnClientSessionDto {
  public readonly id: string;
  public readonly userId: string;
  public readonly device: IResult;
  public readonly connectingAddress: string;
  public readonly createdAt: string;
  public readonly connectedAt?: string;
  public readonly addressAssignedAt?: string;
  public readonly disconnectedAt?: string;
  public readonly serverId?: string;
  public readonly assignedAddress?: string;
  public readonly bytesIn: number;
  public readonly bytesOut: number;

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
