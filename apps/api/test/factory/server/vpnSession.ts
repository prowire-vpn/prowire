import {
  VpnClientSessionSchemaClass,
  type VpnClientSessionModel as IVpnClientSessionModel,
} from 'server/infrastructure/clientSession.schema';
import {
  VpnClientSession,
  type VpnClientSessionConstructorOptions,
} from 'server/domain/clientSession.entity';
import {faker} from '@faker-js/faker';
import {getModel} from 'test/utils';
import {UAParser} from 'ua-parser-js';

export const vpnSessionFactory = {
  build(overrides?: Partial<VpnClientSessionConstructorOptions>): VpnClientSession {
    return new VpnClientSession({
      userId: faker.datatype.uuid(),
      device: UAParser(faker.internet.userAgent()),
      connectingAddress: faker.internet.ip(),
      ...overrides,
    });
  },

  async persist(session: VpnClientSession): Promise<VpnClientSession> {
    const VpnClientSessionModel = getModel(
      VpnClientSessionSchemaClass.name,
    ) as IVpnClientSessionModel;
    const modelData = VpnClientSessionModel.fromDomain(session);
    const model = new VpnClientSessionModel(modelData);
    await model.save();
    return session;
  },
};
