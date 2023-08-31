import {Controller, Get, UseGuards} from '@nestjs/common';
import {ServerService} from 'server/domain';
import {AccessTokenGuard, ClientRolesGuard, Client as IClient} from 'auth/domain';
import {Admin, Client} from 'auth/utils';
import {FindServerResponseBodyDto} from './server.controller.dto';

@Controller('server')
@UseGuards(AccessTokenGuard, ClientRolesGuard)
export class ServerController {
  constructor(private serverService: ServerService) {}

  @Get()
  @Admin()
  async find(): Promise<FindServerResponseBodyDto> {
    const servers = await this.serverService.find();
    return new FindServerResponseBodyDto(servers);
  }

  @Get('connect')
  async connect(@Client() client: IClient): Promise<void> {}
}
