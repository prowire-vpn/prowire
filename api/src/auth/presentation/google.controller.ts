import {Controller, Get, UseGuards, UseFilters, Query, Response} from '@nestjs/common';
import {GoogleOAuthGuard, GoogleOAuthGuardForceRefresh} from 'auth/domain';
import {RedirectExceptionFilter} from './google.controller.exception';
import {AccessTokenService, RefreshTokenService, Client as IClient} from 'auth/domain';
import {Client} from 'auth/utils/client.decorator';
import {Response as IResponse} from 'express';
import {readFileSync} from 'fs';
import {rootPath} from 'root';
import {ConfigService} from '@nestjs/config';
import {createAuthCookie} from './utils';

@Controller('auth/google')
export class GoogleController {
  htmlResponse: string;

  constructor(
    private accessTokenService: AccessTokenService,
    private refreshTokenService: RefreshTokenService,
    private configService: ConfigService,
  ) {
    this.htmlResponse = readFileSync(
      `${rootPath}/../static/post_auth_success_redirect.html`,
      'utf8',
    );
  }

  @Get()
  @UseGuards(GoogleOAuthGuard)
  start() {
    throw new Error('Should redirect before landing here');
  }

  @Get('force-refresh')
  @UseGuards(GoogleOAuthGuardForceRefresh)
  forceRefresh() {
    throw new Error('Should redirect before landing here');
  }

  @Get('redirect')
  @UseGuards(GoogleOAuthGuard)
  @UseFilters(RedirectExceptionFilter)
  redirect(
    @Response() response: IResponse,
    @Query('state') state: string,
    @Client() client: IClient,
  ): void {
    const accessToken = this.accessTokenService.create(client);
    const refreshToken = this.refreshTokenService.create(client);

    const fromDesktop = state.startsWith('desktop:');

    if (fromDesktop) {
      const url = new URL('prowire://oauth/return');
      url.searchParams.append('accessToken', accessToken.token);
      url.searchParams.append('state', state);
      url.searchParams.append('refreshToken', refreshToken.token);
      response.send(this.htmlResponse.replace(/%url%/g, url.toString()));
      return;
    }

    createAuthCookie(response, refreshToken);

    const url = new URL(this.configService.getOrThrow<string>('ADMIN_PANEL_URL'));
    url.pathname = '/auth/return';
    url.searchParams.append('accessToken', accessToken.token);
    url.searchParams.append('state', state);
    response.redirect(url.toString());
  }
}
