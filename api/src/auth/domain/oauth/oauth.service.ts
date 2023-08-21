import {Injectable} from '@nestjs/common';
import {User, UserService} from 'user/domain';
import {OAuth} from './oauth.entity';
import {
  NoRefreshTokenProvidedError,
  MissingDataForAccountCreationError,
} from './oauth.service.error';
import {OauthAuthenticatedEvent} from './oauth.events';
import {EventEmitter2} from '@nestjs/event-emitter';

@Injectable()
export class OAuthService {
  constructor(private userService: UserService, private eventEmitter: EventEmitter2) {}

  async login(authentication: OAuth): Promise<User | undefined> {
    const user = await this.userService.getByEmail(authentication.email);
    return user ? this.knownUserLogin(user, authentication) : this.unknownUserLogin(authentication);
  }

  private async knownUserLogin(user: User, authentication: OAuth): Promise<User> {
    const identity = user.getIdentity(authentication.provider);
    if (!identity && !authentication.hasRequiredRefreshToken)
      throw new NoRefreshTokenProvidedError(user);
    this.eventEmitter.emit(
      OauthAuthenticatedEvent.namespace,
      new OauthAuthenticatedEvent(authentication, user),
    );
    return user;
  }

  private async unknownUserLogin(authentication: OAuth): Promise<User | undefined> {
    const userCount = await this.userService.getUserCount();
    if (userCount !== 0) return;
    if (!authentication.hasDataForAccountCreation)
      throw new MissingDataForAccountCreationError(authentication);
    return await this.userService.register({...authentication.toRegistrationData(), admin: true});
  }
}
