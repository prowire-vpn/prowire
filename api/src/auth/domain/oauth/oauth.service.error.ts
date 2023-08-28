import {User} from 'user/domain';
import {ThirdPartyIdentity} from './thirdPartyIdentity.entity';

export class NoRefreshTokenProvidedError extends Error {
  constructor(user: User) {
    super(
      `No refresh tokens were provided for user "${user.id}" which does not yet have a Google identity`,
    );
  }
}

export class MissingDataForAccountCreationError extends Error {
  constructor(identity: ThirdPartyIdentity) {
    super(
      `Attempted to create account with email "${identity.email}", but missing some account data`,
    );
  }
}

export class InvalidStateError extends Error {
  constructor(state: string) {
    super(`Invalid state "${state}"`);
  }
}

export class InvalidCodeError extends Error {
  constructor(code: string) {
    super(`Invalid code "${code}"`);
  }
}

export class FailedCodeChallengeError extends Error {
  constructor(given: string, calculated: string) {
    super(`Invalid code "${given}", expected "${calculated}"`);
  }
}
