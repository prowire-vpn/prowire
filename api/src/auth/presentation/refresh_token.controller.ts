import {Controller, UseGuards, Response, Post, Request, UseFilters, Body} from '@nestjs/common';
import {AccessTokenService, Client as IClient, RefreshTokenGuard} from 'auth/domain';
import {Client} from 'auth/utils/client.decorator';
import {Request as IRequest, Response as IResponse} from 'express';
import {renewAuthCookieIfExists} from './utils';
import {RefreshExceptionFilter} from './refresh_token.controller.exception';
import {
  RefreshTokenRequestBodyDto,
  RefreshTokenResponseBodyDto,
} from './refresh_token.controller.dto';

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() {refresh_token}: RefreshTokenRequestBodyDto,
  ): IResponse<RefreshTokenResponseBodyDto> {
    if (!refresh_token) throw new Error('Refresh token not found');
    renewAuthCookieIfExists(request, response);
    const accessToken = this.accessTokenService.create(client);
    return response.json({access_token: accessToken.toString(), refresh_token});
  }
}
