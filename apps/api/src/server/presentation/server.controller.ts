import {Controller, Get, Post, UseGuards, Body, Req} from '@nestjs/common';
import {ServerService, VpnConfigService, PkiService, VpnClientSessionService} from 'server/domain';
import {AccessTokenGuard, ClientRolesGuard, Client as IClient} from 'auth/domain';
import {Admin, Client} from 'auth/utils';
import {type Request} from 'express';
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
    private readonly clientSessionService: VpnClientSessionService,
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
    @Req() request: Request,
  ): Promise<ConnectServerResponseBodyDto> {
    if (!request.headers['user-agent']) throw new Error('Missing user-agent');
    const servers = await this.serverService.find();
    const config = await this.vpnConfigService.get();
    const session = await this.clientSessionService.create(
      client.id,
      request.headers['user-agent'],
      request.ip,
    );

    const {certificate, ca} = await this.pkiService.generateCertificate(body.publicKey, session.id);

    return new ConnectServerResponseBodyDto(servers, config, ca, certificate);
  }
}
