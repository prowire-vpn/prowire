import {Controller, Get, Post, UseGuards, Body} from '@nestjs/common';
import {ServerService, VpnConfigService, PkiService} from 'server/domain';
import {AccessTokenGuard, ClientRolesGuard, Client as IClient} from 'auth/domain';
import {Admin, Client} from 'auth/utils';
import {
  FindServerResponseBodyDto,
  ConnectServerRequestBodyDto,
  ConnectServerResponseBodyDto,
} from './server.controller.dto';

@Controller('server')
@UseGuards(AccessTokenGuard, ClientRolesGuard)
export class ServerController {
  constructor(
    private readonly serverService: ServerService,
    private readonly vpnConfigService: VpnConfigService,
    private readonly pkiService: PkiService,
  ) {}

  @Get()
  @Admin()
  async find(): Promise<FindServerResponseBodyDto> {
    const servers = await this.serverService.find();
    return new FindServerResponseBodyDto(servers);
  }

  @Post('connect')
  async connect(
    @Client() client: IClient,
    @Body() body: ConnectServerRequestBodyDto,
  ): Promise<ConnectServerResponseBodyDto> {
    const servers = await this.serverService.find();
    const config = await this.vpnConfigService.get();
    const {certificate, ca} = await this.pkiService.generateCertificate(body.publicKey, client.id);
    return new ConnectServerResponseBodyDto(servers, config, ca, certificate);
  }
}
