import {Module} from '@nestjs/common';
import {OpenVpnService} from './domain';
import {TelnetManager, ProcessManager} from './infrastructure';
import {OpenVpnMessageHandler} from './presentation';
import {LifecycleModule} from 'lifecycle';
import {ServerModule} from 'server';

@Module({
  imports: [ServerModule, LifecycleModule],
  providers: [OpenVpnService, TelnetManager, ProcessManager, OpenVpnMessageHandler],
})
export class OpenVpnModule {}
