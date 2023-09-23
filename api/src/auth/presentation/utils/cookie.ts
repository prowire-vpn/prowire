import {type Response, type CookieOptions, type Request} from 'express';
import {RefreshToken} from 'auth/domain';

const cookieName = 'prowire_auth';
const cookieOptions: CookieOptions = {
  secure: true,
  httpOnly: true,
  path: '/',
  sameSite: 'lax',
  maxAge: 30 * 24 * 60 * 60 * 1000,
};

export function createAuthCookie(response: Response, refreshToken: RefreshToken): void {
  response.cookie(
    cookieName,
    JSON.stringify({refreshToken: refreshToken.toString()}),
    cookieOptions,
  );
}

export function clearAuthCookie(response: Response): void {
  response.clearCookie(cookieName, cookieOptions);
}

export function renewAuthCookieIfExists(request: Request, response: Response): void {
  const cookie = request.cookies[cookieName];
  if (cookie) {
    response.cookie(cookieName, cookie, cookieOptions);
  }
}

export function getRefreshTokenFromCookie(request: Request): string | undefined {
  const cookie = request.cookies?.[cookieName];
  if (!cookie) return undefined;
  const {refreshToken} = JSON.parse(cookie);
  return refreshToken;
}
