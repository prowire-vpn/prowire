import {OauthAuthenticatedEvent} from 'auth/domain/oauth/oauth.events';
import {OnEvent} from '@nestjs/event-emitter';
import {MissingIdentityCreationDataError} from './auth.listener.error';
import {UserRepository} from 'user/infrastructure';
import {Injectable} from '@nestjs/common';

@Injectable()
export class AuthListener {
  constructor(private userRepository: UserRepository) {}

  @OnEvent(OauthAuthenticatedEvent.namespace)
  async onOauthAuthenticated(event: OauthAuthenticatedEvent) {
    const user = event.user;
    const provider = event.authentication.provider;
    const providerInformation = event.authentication.toIdentityData();
    if (user.hasIdentity(provider)) {
      user.updateIdentity(provider, providerInformation);
    } else {
      const {accessToken, refreshToken} = providerInformation;
      if (!accessToken || !refreshToken) throw new MissingIdentityCreationDataError(user, provider);
      user.addIdentity(provider, {...providerInformation, accessToken, refreshToken});
    }
    await this.userRepository.persist(user);
    return user;
  }
}
