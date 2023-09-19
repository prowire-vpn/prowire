import {Injectable} from '@nestjs/common';
import {VpnClientSession} from './clientSession.entity';
import {UAParser} from 'ua-parser-js';
import {VpnClientSessionRepository} from 'server/infrastructure/clientSession.repository';
import {
  VpnClientSessionNotFoundError,
  VpnClientSessionTerminatedError,
} from './clientSession.service.error';

@Injectable()
export class VpnClientSessionService {
  constructor(private readonly sessionRepository: VpnClientSessionRepository) {}

  /** Create a new session, should be called when the user requests VPN connection information */
  async create(
    userId: string,
    userAgent: string,
    connectingAddress: string,
  ): Promise<VpnClientSession> {
    const session = new VpnClientSession({userId, connectingAddress, device: UAParser(userAgent)});
    this.sessionRepository.persist(session);
    return session;
  }

  /** Fetch a session given its ID and ensures it exists and is not terminated already */
  private async getOngoingSession(sessionId: string): Promise<VpnClientSession> {
    const session = await this.sessionRepository.get(sessionId);
    if (!session) throw new VpnClientSessionNotFoundError(sessionId);
    if (!session?.isOngoing) throw new VpnClientSessionTerminatedError(session);
    return session;
  }

  /** Set a session as connected, to be called when the user connects to the server or re-auth */
  async connect(serverId: string, sessionId: string): Promise<VpnClientSession> {
    const session = await this.getOngoingSession(sessionId);
    session.connect(serverId);
    this.sessionRepository.persist(session);
    return session;
  }

  /** Set a session as disconnected, to be called when the user disconnects from the server */
  async disconnect(sessionId: string): Promise<VpnClientSession> {
    const session = await this.getOngoingSession(sessionId);
    session.disconnect();
    this.sessionRepository.persist(session);
    return session;
  }

  /** Assign an address to a session, to be called once the server assigned an address */
  async assignAddress(sessionId: string, address: string): Promise<VpnClientSession> {
    const session = await this.getOngoingSession(sessionId);
    session.assignAddress(address);
    this.sessionRepository.persist(session);
    return session;
  }
}
