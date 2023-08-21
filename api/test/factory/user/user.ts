import {UserSchemaClass} from 'user/infrastructure';
import {User, UserConstructor, EmailAddress} from 'user/domain';
import {faker} from '@faker-js/faker';
import {UserMapper} from 'user/utils';
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
    const UserModel = getModel(UserSchemaClass.name);
    const modelData = UserMapper.toModelData(user);
    const model = new UserModel(modelData);
    await model.save();
    return user;
  },
};
