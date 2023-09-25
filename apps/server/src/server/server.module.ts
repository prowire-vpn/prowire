import {Module} from '@nestjs/common';
import {ApiGateway} from './presentation';
import {PkiService} from './domain';
import {LifecycleModule} from 'lifecycle';

@Module({
  imports: [LifecycleModule],
  controllers: [],
  providers: [ApiGateway, PkiService],
  exports: [ApiGateway, PkiService],
})
export class ServerModule {}
