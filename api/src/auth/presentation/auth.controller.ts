import {Controller, Post, UseFilters, Body, Response} from '@nestjs/common';
import {AccessTokenService, RefreshTokenService, OAuthService} from 'auth/domain';
import {UserService} from 'organization/domain';
import {AuthTokenRequestBodyDto} from './auth.controller.dto';
import {Client} from 'auth/domain/client.entity';
import {createAuthCookie} from './utils';
import {type Response as IResponse} from 'express';
import {TokenExceptionFilter} from './auth.controller.exception';

@Controller('auth')
export class AuthController {
  constructor(
    private accessTokenService: AccessTokenService,
    private refreshTokenService: RefreshTokenService,
    private oauthService: OAuthService,
    private userService: UserService,
  ) {}

  @Post('token')
  @UseFilters(TokenExceptionFilter)
  async token(
    @Response() response: IResponse,
    @Body() {code, code_verifier}: AuthTokenRequestBodyDto,
  ) {
    const session = await this.oauthService.verifySessionCode({code, codeVerifier: code_verifier});
    if (!session.userId) throw new Error('User not attached to session');
    const user = await this.userService.get(session.userId);
    if (!user) throw new Error('User from session not found');
    const client = Client.fromUser(user);
    const accessToken = await this.accessTokenService.create(client);
    const refreshToken = await this.refreshTokenService.create(client);
    createAuthCookie(response, refreshToken);
    return response.send({
      access_token: accessToken.toString(),
      refresh_token: refreshToken.toString(),
    });
  }
}
