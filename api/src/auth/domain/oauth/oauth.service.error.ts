import {User} from 'user/domain';
import {OAuth} from './oauth.entity';

export class NoRefreshTokenProvidedError extends Error {
  constructor(user: User) {
    super(
      `No refresh tokens were provided for user "${user.id}" which does not yet have a Google identity`,
    );
  }
}

export class MissingDataForAccountCreationError extends Error {
  constructor(authentication: OAuth) {
    super(
      `Attempted to create account with email "${authentication.email}", but missing some account data`,
    );
  }
}
