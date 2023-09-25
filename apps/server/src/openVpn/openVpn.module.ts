import {Module} from '@nestjs/common';
import {OpenVpnService} from './domain';
import {TelnetManager, ProcessManager} from './infrastructure';
import {OpenVpnMessenger} from './presentation';
import {LifecycleModule} from 'lifecycle';
import {ServerModule} from 'server';

@Module({
  imports: [ServerModule, LifecycleModule],
  providers: [OpenVpnService, TelnetManager, ProcessManager, OpenVpnMessenger],
})
export class OpenVpnModule {}
