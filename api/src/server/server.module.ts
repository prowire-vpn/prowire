import {Module} from '@nestjs/common';
import {ServerService, VpnConfigService, PkiService, ServerListener} from './domain';
import {MongooseModule} from '@nestjs/mongoose';
import {
  ServerSchemaClass,
  ServerSchema,
  ServerRepository,
  VpnConfigSchemaClass,
  VpnConfigSchema,
  VpnConfigRepository,
} from './infrastructure';
import {ServerGateway, ServerController} from './presentation';
import {LeaderModule} from 'leader';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: ServerSchemaClass.name, schema: ServerSchema},
      {name: VpnConfigSchemaClass.name, schema: VpnConfigSchema},
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
    ServerListener,
  ],
  exports: [ServerService],
})
export class ServerModule {}
