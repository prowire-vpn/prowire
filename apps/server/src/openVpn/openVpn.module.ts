import {Module} from '@nestjs/common';
import {OpenVpnService} from './domain';
import {OpenVpnManager} from './infrastructure';
import {OpenVpnMessenger} from './presentation';
import {LifecycleModule} from 'lifecycle';
import {ServerModule} from 'server';

@Module({
  imports: [ServerModule, LifecycleModule],
  providers: [OpenVpnService, OpenVpnManager, OpenVpnManager, OpenVpnMessenger],
})
export class OpenVpnModule {}
