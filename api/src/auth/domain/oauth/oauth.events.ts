import {OAuth} from './oauth.entity';
import {User} from 'user/domain';

export class OauthAuthenticatedEvent {
  public static namespace = 'auth.oauth.authenticated';
  public authentication: OAuth;
  public user: User;
  constructor(authentication: OAuth, user: User) {
    this.authentication = authentication;
    this.user = user;
  }
}
