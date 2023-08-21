import {RefreshToken} from './refresh_token.entity';

export class NoUserAccountForRefreshTokenError extends Error {
  constructor(token: RefreshToken) {
    super(`No user account found for refresh token with user ID "${token.subject}"`);
  }
}
