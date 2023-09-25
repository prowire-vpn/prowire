import {PassportStrategy} from '@nestjs/passport';
import {Injectable} from '@nestjs/common';
import {Strategy as CookieStrategy} from 'passport-cookie';
import {Strategy as CustomStrategy} from 'passport-custom';
import {RefreshTokenService} from './refresh_token.service';
import {type Request} from 'express';
import {Client} from 'auth/domain/client.entity';
import {RefreshTokenNotProvidedError} from './refresh_token.strategy.error';

@Injectable()
export class RefreshTokenCookieStrategy extends PassportStrategy(
  CookieStrategy,
  'refresh-token-cookie',
) {
  constructor(private refreshTokenService: RefreshTokenService) {
    super({
      cookieName: 'prowire_auth',
    });
  }

  async validate(authCookie: string): Promise<Client> {
    const {refreshToken} = JSON.parse(authCookie);
    const client = await this.refreshTokenService.verify(refreshToken);
    if (!client) throw new Error('Client was not returned from refresh token service');
    return client;
  }
}

@Injectable()
export class RefreshTokenBodyStrategy extends PassportStrategy(
  CustomStrategy,
  'refresh-token-body',
) {
  constructor(private refreshTokenService: RefreshTokenService) {
    super();
  }

  async validate(request: Request): Promise<Client> {
    const token = request.body?.refresh_token;
    if (!token) throw new RefreshTokenNotProvidedError();
    const client = await this.refreshTokenService.verify(token);
    if (!client) throw new Error('Client was not returned from refresh token service');
    return client;
  }
}
