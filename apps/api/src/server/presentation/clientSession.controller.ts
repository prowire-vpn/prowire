import {Controller, Get, UseGuards, Param, Query} from '@nestjs/common';
import {VpnClientSessionService} from 'server/domain';
import {AccessTokenGuard, ClientRolesGuard} from 'auth/domain';
import {Admin} from 'auth/utils';
import {ListUserClientSessionResponseBodyDto} from './clientSession.controller.dto';

@Controller('server/client-session')
@UseGuards(AccessTokenGuard, ClientRolesGuard)
export class VpnClientSessionController {
  constructor(private readonly clientSessionService: VpnClientSessionService) {}

  @Get('/user/:userId')
  @Admin()
  async listUser(
    @Param('userId') userId: string,
    @Query('limit') limit?: string,
    @Query('page') page?: string,
  ): Promise<ListUserClientSessionResponseBodyDto> {
    const result = await this.clientSessionService.findByUserId(userId, {
      limit: limit ? parseInt(limit) : 10,
      page: page ? parseInt(page) : 0,
    });
    return new ListUserClientSessionResponseBodyDto(result);
  }
}
