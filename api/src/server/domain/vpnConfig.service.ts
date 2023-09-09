import {VpnConfig} from './vpnConfig.entity';
import {VpnConfigRepository} from 'server/infrastructure/vpnConfig.repository';
import {Injectable} from '@nestjs/common';

@Injectable()
export class VpnConfigService {
  constructor(private vpnConfigRepository: VpnConfigRepository) {}

  public async get(): Promise<VpnConfig> {
    return await this.vpnConfigRepository.get();
  }
}
