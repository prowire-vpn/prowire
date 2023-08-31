import {Injectable} from '@nestjs/common';
import {VpnConfigModel, VpnConfigSchemaClass} from './vpnConfig.schema';
import {InjectModel} from '@nestjs/mongoose';
import {VpnConfig} from 'server/domain/vpnConfig.entity';

@Injectable()
export class VpnConfigRepository {
  constructor(@InjectModel(VpnConfigSchemaClass.name) private vpnConfigModel: VpnConfigModel) {}

  async persist(config: VpnConfig): Promise<VpnConfig> {
    await this.vpnConfigModel.findOneAndUpdate(undefined, this.vpnConfigModel.fromDomain(config), {
      new: true,
      upsert: true,
      returnOriginal: true,
    });
    return config;
  }

  async get(): Promise<VpnConfig> {
    const config = await this.vpnConfigModel.findOne();
    return config ? config.toDomain() : VpnConfig.getDefaultConfig();
  }
}
