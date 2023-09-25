import {Module} from '@nestjs/common';
import {ConfigSchema} from './config';
import {ConfigModule} from '@nestjs/config';
import {ServerModule} from './server';
import {OpenVpnModule} from './openVpn';
import {EventEmitterModule} from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: ConfigSchema,
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    ServerModule,
    OpenVpnModule,
  ],
  controllers: [],
})
export class AppModule {}
