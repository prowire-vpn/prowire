import {ThirdPartyIdentity} from './thirdPartyIdentity.entity';
import {User} from 'organization/domain';

export class OauthAuthenticatedEvent {
  public static namespace = 'auth.oauth.authenticated';
  public authentication: ThirdPartyIdentity;
  public user: User;
  constructor(authentication: ThirdPartyIdentity, user: User) {
    this.authentication = authentication;
    this.user = user;
  }
}
