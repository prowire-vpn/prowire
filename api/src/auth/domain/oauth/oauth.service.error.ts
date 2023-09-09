import {User} from 'organization/domain';
import {ThirdPartyIdentity} from './thirdPartyIdentity.entity';
import {ClientError} from 'app/domain';

export class NoRefreshTokenProvidedError extends ClientError {
  constructor({user, identity}: {user?: User; identity?: ThirdPartyIdentity}) {
    super(
      'no-refresh-token-provided',
      `No refresh tokens were provided for user "${
        user?.id ?? identity?.email ?? 'new user'
      }" which does not yet have a Google identity`,
    );
  }
}

export class MissingDataForAccountCreationError extends ClientError {
  constructor(identity: ThirdPartyIdentity) {
    super(
      'missing-data-for-account-creation',
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
