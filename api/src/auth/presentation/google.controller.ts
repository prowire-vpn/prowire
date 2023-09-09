import {Controller, Get, UseGuards, UseFilters, Query, Response} from '@nestjs/common';
import {GoogleOAuthGuard, GoogleOAuthGuardInit, GoogleOAuthGuardForceRefresh} from 'auth/domain';
import {RedirectExceptionFilter} from './google.controller.exception';
import {Client as IClient} from 'auth/domain';
import {Client} from 'auth/utils/client.decorator';
import {Response as IResponse} from 'express';
import {StartGoogleFlowQueryDto} from './google.controller.dto';
import {OAuthService} from 'auth/domain/oauth';

@Controller('auth/google')
export class GoogleController {
  constructor(private oauthService: OAuthService) {}

  @Get()
  @UseGuards(GoogleOAuthGuardInit)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  start(@Query() _query: StartGoogleFlowQueryDto) {
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
  async redirect(
    @Response() response: IResponse,
    @Query('state') state: string,
    @Client() client: IClient,
  ): Promise<void> {
    const session = await this.oauthService.issueOAuthSessionCode(state, client);
    response.redirect(session.redirectionUrl);
  }
}
