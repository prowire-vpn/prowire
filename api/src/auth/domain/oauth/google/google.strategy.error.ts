import {Profile} from 'passport-google-oauth20';

export class NoVerifiedEmailError extends Error {
  constructor(profile: Profile) {
    const length = profile.emails?.length ?? 0;
    super(`Cannot find verified email on Google profile (${length} email present)`);
  }
}
