import {Module} from '@nestjs/common';
import {ShutdownService} from './shutdown.service';

@Module({
  imports: [],
  controllers: [],
  providers: [ShutdownService],
  exports: [ShutdownService],
})
export class LifecycleModule {}
