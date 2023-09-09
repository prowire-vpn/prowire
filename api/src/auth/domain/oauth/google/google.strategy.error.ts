import {Profile} from 'passport-google-oauth20';
import {ClientError} from 'app/domain';

export class NoVerifiedEmailError extends ClientError {
  constructor(profile: Profile) {
    const length = profile.emails?.length ?? 0;
    super(
      'email-unverified',
      `Cannot find verified email on Google profile (${length} email present)`,
    );
  }
}

export class UnauthorizedRedirectUri extends ClientError {
  constructor(redirectUri: string) {
    super('unauthorized-redirect-uri', `Unauthorized redirect uri ${redirectUri}`);
  }
}

export class UserNotFoundError extends Error {
  constructor(email: string) {
    super(`Cannot find user with email ${email}`);
  }
}
