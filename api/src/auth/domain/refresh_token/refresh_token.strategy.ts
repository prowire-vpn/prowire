import {PassportStrategy} from '@nestjs/passport';
import {Injectable, UnauthorizedException} from '@nestjs/common';
import {Strategy as CookieStrategy} from 'passport-cookie';
import {Strategy as CustomStrategy} from 'passport-custom';
import {RefreshTokenService} from './refresh_token.service';
import {Request} from 'express';
import {Client} from 'auth/domain/client.entity';

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
    if (!client) throw new UnauthorizedException();
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
    const token = request.body?.refreshToken;
    if (!token) throw new UnauthorizedException();
    const client = await this.refreshTokenService.verify(token);
    if (!client) throw new UnauthorizedException();
    return client;
  }
}
