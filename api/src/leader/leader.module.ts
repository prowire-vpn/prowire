import {Module} from '@nestjs/common';

import {LeaderService} from './domain';
import {LeaderRepository} from './infrastructure';

@Module({
  providers: [LeaderRepository, LeaderService],
  exports: [LeaderService],
})
export class LeaderModule {}
