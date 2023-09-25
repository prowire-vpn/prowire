import {type VpnConfigModel, VpnConfigSchemaClass} from 'server/infrastructure';
import {VpnConfig, type VpnConfigConstructor, Subnet} from 'server/domain';
import {faker} from '@faker-js/faker';
import {getModel} from 'test/utils';

export const vpnConfigFactory = {
  build(overrides?: Partial<VpnConfigConstructor>): VpnConfig {
    return new VpnConfig({
      subnet: new Subnet(`${faker.internet.ipv4()}/32`),
      routes: [],
      ...overrides,
    });
  },

  async persist(config: VpnConfig): Promise<VpnConfig> {
    const VpnConfigModelClass = getModel(VpnConfigSchemaClass.name) as VpnConfigModel;
    const modelData = VpnConfigModelClass.fromDomain(config);
    const model = new VpnConfigModelClass(modelData);
    await model.save();
    return config;
  },
};
