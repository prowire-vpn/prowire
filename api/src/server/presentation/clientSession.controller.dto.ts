import {VpnClientSession} from 'server/domain/clientSession.entity';

export class ListUserClientSessionResponseBodyDto {
  public sessions: VpnClientSession[];
  public total: number;

  constructor({sessions, total}: {sessions: VpnClientSession[]; total: number}) {
    this.sessions = sessions;
    this.total = total;
  }
}
