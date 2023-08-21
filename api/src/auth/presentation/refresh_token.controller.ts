import {Controller, UseGuards, Response, Post, Request, UseFilters} from '@nestjs/common';
import {AccessTokenService, Client as IClient, RefreshTokenGuard} from 'auth/domain';
import {Client} from 'auth/utils/client.decorator';
import {Request as IRequest, Response as IResponse} from 'express';
import {renewAuthCookieIfExists} from './utils';
import {RefreshExceptionFilter} from './refresh_token.controller.exception';

@Controller('auth/refresh')
export class RefreshTokenController {
  constructor(private accessTokenService: AccessTokenService) {}

  @Post()
  @UseGuards(RefreshTokenGuard)
  @UseFilters(RefreshExceptionFilter)
  refresh(
    @Request() request: IRequest,
    @Response() response: IResponse,
    @Client() client: IClient,
  ) {
    renewAuthCookieIfExists(request, response);
    const accessToken = this.accessTokenService.create(client);
    response.json({accessToken: accessToken.token});
  }
}
