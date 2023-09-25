import {OAuthSessionClass, type OAuthSessionModel as IOAuthSessionModel} from 'auth/infrastructure';
import {OAuthSession, type OAuthSessionConstructor} from 'auth/domain';
import {faker} from '@faker-js/faker';
import {getModel} from 'test/utils';

export const oauthSessionFactory = {
  build(overrides?: Partial<OAuthSessionConstructor>): OAuthSession {
    return new OAuthSession({
      state: faker.random.alphaNumeric(32),
      code_challenge: faker.random.alphaNumeric(32),
      redirect_uri: faker.internet.url(),
      provider: 'google',
      ...overrides,
    });
  },

  async persist(session: OAuthSession): Promise<OAuthSession> {
    const UserModel = getModel(OAuthSessionClass.name) as IOAuthSessionModel;
    const modelData = UserModel.fromDomain(session);
    const model = new UserModel(modelData);
    await model.save();
    return session;
  },
};
