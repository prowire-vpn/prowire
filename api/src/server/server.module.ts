import {Module} from '@nestjs/common';
import {ServerService, VpnConfigService, PkiService} from './domain';
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

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: ServerSchemaClass.name, schema: ServerSchema},
      {name: VpnConfigSchemaClass.name, schema: VpnConfigSchema},
    ]),
  ],
  controllers: [ServerController],
  providers: [
    ServerService,
    ServerGateway,
    ServerRepository,
    VpnConfigService,
    VpnConfigRepository,
    PkiService,
  ],
  exports: [ServerService],
})
export class ServerModule {}
