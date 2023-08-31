import {Injectable, Inject, forwardRef} from '@nestjs/common';
import {User, UserService} from 'user/domain';
import {ThirdPartyIdentity} from './thirdPartyIdentity.entity';
import {
  NoRefreshTokenProvidedError,
  MissingDataForAccountCreationError,
  InvalidStateError,
  InvalidCodeError,
  FailedCodeChallengeError,
} from './oauth.service.error';
import {OauthAuthenticatedEvent} from './oauth.events';
import {EventEmitter2} from '@nestjs/event-emitter';
import {OAuthSession, OAuthSessionConstructor} from './oauthSession.entity';
import {OAuthSessionRepository} from 'auth/infrastructure';
import {Client} from 'auth/domain/client.entity';
import {createHash} from 'crypto';

@Injectable()
export class OAuthService {
  constructor(
    private userService: UserService,
    private eventEmitter: EventEmitter2,
    @Inject(forwardRef(() => OAuthSessionRepository))
    private sessionRepository: OAuthSessionRepository,
  ) {}

  async login(identity: ThirdPartyIdentity): Promise<User | undefined> {
    const user = await this.userService.getByEmail(identity.email);
    return user ? this.knownUserLogin(user, identity) : this.unknownUserLogin(identity);
  }

  private async knownUserLogin(user: User, thirdPartyIdentity: ThirdPartyIdentity): Promise<User> {
    const identity = user.getIdentity(thirdPartyIdentity.provider);
    if (!identity && !thirdPartyIdentity.hasRequiredRefreshToken)
      throw new NoRefreshTokenProvidedError(user);
    this.eventEmitter.emit(
      OauthAuthenticatedEvent.namespace,
      new OauthAuthenticatedEvent(thirdPartyIdentity, user),
    );
    return user;
  }

  private async unknownUserLogin(identity: ThirdPartyIdentity): Promise<User | undefined> {
    const userCount = await this.userService.getUserCount();
    if (userCount !== 0) return;
    if (!identity.hasDataForAccountCreation) throw new MissingDataForAccountCreationError(identity);
    return await this.userService.register({...identity.toRegistrationData(), admin: true});
  }

  async startOAuthSession(
    data: Pick<OAuthSessionConstructor, 'state' | 'code_challenge' | 'redirect_uri'>,
  ): Promise<OAuthSession> {
    const session = new OAuthSession(data);
    await this.sessionRepository.persist(session);
    return session;
  }

  async issueOAuthSessionCode(state: string, client: Client): Promise<OAuthSession> {
    const session = await this.sessionRepository.find({state});
    if (!session || !session.hasValidState) throw new InvalidStateError(state);
    session.issueCode(client);
    await this.sessionRepository.persist(session);
    return session;
  }

  async verifySessionCode({
    code,
    codeVerifier,
  }: {
    code: string;
    codeVerifier: string;
  }): Promise<OAuthSession> {
    const session = await this.sessionRepository.find({code});
    if (!session || !session.hasValidCode) throw new InvalidCodeError(code);
    session.useCode();
    await this.sessionRepository.persist(session);
    const codeChallenge = createHash('sha-256')
      .update(Buffer.from(codeVerifier, 'base64url'))
      .digest('base64url');

    if (codeChallenge !== session.code_challenge)
      throw new FailedCodeChallengeError(session.code_challenge, codeChallenge);

    return session;
  }
}
