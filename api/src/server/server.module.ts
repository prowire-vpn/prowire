import {Module} from '@nestjs/common';
import {ServerService, VpnConfigService, PkiService, VpnClientSessionService} from './domain';
import {MongooseModule} from '@nestjs/mongoose';
import {
  ServerSchemaClass,
  ServerSchema,
  ServerRepository,
  VpnConfigSchemaClass,
  VpnConfigSchema,
  VpnConfigRepository,
  VpnClientSessionRepository,
  VpnClientSessionSchemaClass,
  VpnClientSessionSchema,
} from './infrastructure';
import {
  ServerGateway,
  ServerController,
  ServerMessenger,
  VpnClientSessionMessenger,
  VpnClientSessionController,
} from './presentation';
import {LeaderModule} from 'leader';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: ServerSchemaClass.name, schema: ServerSchema},
      {name: VpnConfigSchemaClass.name, schema: VpnConfigSchema},
      {name: VpnClientSessionSchemaClass.name, schema: VpnClientSessionSchema},
    ]),
    LeaderModule,
  ],
  controllers: [ServerController],
  providers: [
    ServerService,
    ServerGateway,
    ServerRepository,
    VpnConfigService,
    VpnConfigRepository,
    PkiService,
    ServerMessenger,
    VpnClientSessionService,
    VpnClientSessionRepository,
    VpnClientSessionController,
    VpnClientSessionMessenger,
  ],
  exports: [ServerService],
})
export class ServerModule {}
