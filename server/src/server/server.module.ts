import {Module} from '@nestjs/common';
import {ApiGateway} from './presentation';
import {MessageService, PkiService} from './domain';
import {LifecycleModule} from 'lifecycle';

@Module({
  imports: [LifecycleModule],
  controllers: [],
  providers: [ApiGateway, MessageService, PkiService],
  exports: [MessageService, PkiService],
})
export class ServerModule {}
