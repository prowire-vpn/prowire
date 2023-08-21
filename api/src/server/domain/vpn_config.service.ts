import {VpnConfig} from './vpn_config.entity';
import {VpnConfigRepository} from 'server/infrastructure/vpn_config.repository';
import {Injectable} from '@nestjs/common';

@Injectable()
export class VpnConfigService {
  constructor(private vpnConfigRepository: VpnConfigRepository) {}

  public async get(): Promise<VpnConfig> {
    return await this.vpnConfigRepository.get();
  }
}
