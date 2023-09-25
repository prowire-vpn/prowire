import {VpnClientSession} from './clientSession.entity';

export class VpnClientSessionNotFoundError extends Error {
  constructor(sessionId: string) {
    super(`VPN client session not found [id: ${sessionId}]`);
  }
}

export class VpnClientSessionTerminatedError extends Error {
  constructor(session: VpnClientSession) {
    super(`VPN client session has already ended [id: ${session.id}]`);
  }
}
