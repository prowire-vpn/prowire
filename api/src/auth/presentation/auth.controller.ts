import {Controller, Post, UseFilters, Body} from '@nestjs/common';
import {RedirectExceptionFilter} from './google.controller.exception';
import {AccessTokenService, RefreshTokenService} from 'auth/domain';
import {UserService} from 'organization/domain';
import {OAuthService} from 'auth/domain/oauth';
import {AuthTokenRequestBodyDto, AuthTokenResponseBodyDto} from './auth.controller.dto';
import {Client} from 'auth/domain/client.entity';
import {createAuthCookie} from './utils';

@Controller('auth')
export class AuthController {
  constructor(
    private accessTokenService: AccessTokenService,
    private refreshTokenService: RefreshTokenService,
    private oauthService: OAuthService,
    private userService: UserService,
  ) {}

  @Post('token')
  @UseFilters(RedirectExceptionFilter)
  async redirect(
    @Body() {code, code_verifier}: AuthTokenRequestBodyDto,
  ): Promise<AuthTokenResponseBodyDto> {
    const session = await this.oauthService.verifySessionCode({code, codeVerifier: code_verifier});
    if (!session.userId) throw new Error('User not attached to session');
    const user = await this.userService.get(session.userId);
    if (!user) throw new Error('User from session not found');
    const client = Client.fromUser(user);
    const accessToken = await this.accessTokenService.create(client);

    // TODO: set cookie
    const refreshToken = await this.refreshTokenService.create(client);
    return {access_token: accessToken.toString(), refresh_token: refreshToken.toString()};
  }
}
