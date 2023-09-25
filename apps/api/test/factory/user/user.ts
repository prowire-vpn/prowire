import {UserSchemaClass, type UserModel as IUserModel} from 'organization/infrastructure';
import {User, type UserConstructor, EmailAddress} from 'organization/domain';
import {faker} from '@faker-js/faker';
import {getModel} from 'test/utils';

export const userFactory = {
  build(overrides?: Partial<UserConstructor>): User {
    return new User({
      name: faker.name.fullName(),
      email: new EmailAddress(faker.internet.email()),
      avatar: faker.internet.avatar(),
      ...overrides,
    });
  },

  async persist(user: User): Promise<User> {
    const UserModel = getModel(UserSchemaClass.name) as IUserModel;
    const modelData = UserModel.fromDomain(user);
    const model = new UserModel(modelData);
    await model.save();
    return user;
  },
};
