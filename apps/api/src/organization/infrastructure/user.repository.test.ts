import {MongooseModule, getModelToken} from '@nestjs/mongoose';
import {Test, TestingModule} from '@nestjs/testing';
import {
  UserRepository,
  UserSchemaClass,
  UserSchema,
  type UserModel,
} from 'organization/infrastructure';
import {build, create} from 'test/factory';
import {faker} from '@faker-js/faker';
import {EmailAddress} from 'organization/domain';
import {ConfigModule, ConfigService} from '@nestjs/config';

/**
 * Tests UserRepository class
 * @group integration
 */
describe('UserRepository', () => {
  let module: TestingModule;
  let userRepository: UserRepository;
  let userModel: UserModel;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            uri: configService.getOrThrow<string>('MONGO_CONNECTION_STRING'),
            user: configService.get<string>('MONGO_USER'),
            pass: configService.get<string>('MONGO_PASSWORD'),
            dbName: configService.get<string>('MONGO_DATABASE'),
          }),
        }),
        MongooseModule.forFeature([{name: UserSchemaClass.name, schema: UserSchema}]),
      ],
      providers: [UserRepository],
    }).compile();
    userRepository = module.get<UserRepository>(UserRepository);
    userModel = module.get<UserModel>(getModelToken(UserSchemaClass.name));
  });

  afterEach(async () => {
    await module.close();
  });

  describe('persist', () => {
    it('should create a new user', async () => {
      const user = await build('user');

      await userRepository.persist(user);

      const result = await userModel.findById(user.id);
      expect(result).not.toBeNull();
      expect(result?.name).toBe(user.name);
    });

    it('should update an existing user', async () => {
      const name = faker.name.fullName();
      const user = await create('user');
      user.name = name;

      await userRepository.persist(user);

      const result = await userModel.findById(user.id);
      expect(result).not.toBeNull();
      expect(result?.name).toBe(name);
    });
  });

  describe('delete', () => {
    it('should delete an existing user', async () => {
      const user = await create('user');

      await userRepository.delete(user);

      const result = await userModel.findById(user.id);
      expect(result).toBeNull();
    });

    it('should not fail if attempting to delete an non-existing user', async () => {
      const user = await build('user');

      await userRepository.delete(user);
    });
  });

  describe('findByEmail', () => {
    it('should return a user with same email', async () => {
      const user = await create('user');

      const result = await userRepository.findByEmail(user.email);

      expect(result).not.toBeNull();
      expect(result?.id).toBe(user.id);
    });

    it('should return null if no user match', async () => {
      const user = await build('user');

      const result = await userRepository.findByEmail(user.email);

      expect(result).toBeNull();
    });
  });

  describe('find', () => {
    it('should find a user with email', async () => {
      const email = faker.internet.email(faker.datatype.uuid());
      const emailName = email.split('@')[0];
      const user = await create('user', {email: new EmailAddress(email)});

      const result = await userRepository.find(emailName, 10, 1);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(user.id);
    });

    it('should find a user by email domain', async () => {
      const email = faker.internet.email(undefined, undefined, faker.datatype.uuid());
      const emailDomain = email.split('@')[1];
      const user = await create('user', {email: new EmailAddress(email)});

      const result = await userRepository.find(emailDomain, 10, 1);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(user.id);
    });

    it('should not find a user by non matching email', async () => {
      const email = faker.internet.email();
      await create('user', {email: new EmailAddress(email)});

      const result = await userRepository.find(faker.datatype.uuid(), 10, 1);

      expect(result).toHaveLength(0);
    });

    it('should find a user by first name', async () => {
      const name = faker.datatype.uuid();
      const user = await create('user', {name});

      const result = await userRepository.find(name, 10, 1);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(user.id);
    });

    it('should find a user by last name', async () => {
      const name = faker.datatype.uuid();
      const user = await create('user', {name: `John ${name}`});

      const result = await userRepository.find(name, 10, 1);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(user.id);
    });

    it('should find a user by id', async () => {
      const user = await create('user');

      const result = await userRepository.find(user.id, 10, 1);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(user.id);
    });
  });
});
