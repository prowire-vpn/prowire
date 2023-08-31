import {MongooseModule, getModelToken} from '@nestjs/mongoose';
import {Test, TestingModule} from '@nestjs/testing';
import {UserRepository, UserSchemaClass, UserSchema, UserModel} from 'organization/infrastructure';
import {build, create} from 'test/factory';
import {MongoMemoryServer} from 'mongodb-memory-server';
import {faker} from '@faker-js/faker';
import {EmailAddress} from 'organization/domain';

describe('UserRepository', () => {
  let module: TestingModule;
  let mongod: MongoMemoryServer;
  let userRepository: UserRepository;
  let userModel: UserModel;

  beforeEach(async () => {
    mongod = await MongoMemoryServer.create();
    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongod.getUri()),
        MongooseModule.forFeature([{name: UserSchemaClass.name, schema: UserSchema}]),
      ],
      providers: [UserRepository],
    }).compile();
    userRepository = module.get<UserRepository>(UserRepository);
    userModel = module.get<UserModel>(getModelToken(UserSchemaClass.name));
  });

  afterEach(async () => {
    await module.close();
    await mongod.stop();
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
      const user = await create('user', {email: new EmailAddress('findMe@test.com')});

      const result = await userRepository.find('findMe', 10, 1);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(user.id);
    });

    it('should find a user by email domain', async () => {
      const user = await create('user', {email: new EmailAddress('findMe@test.com')});

      const result = await userRepository.find('test.com', 10, 1);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(user.id);
    });

    it('should not find a user by non matching email', async () => {
      await create('user', {email: new EmailAddress('findMe@test.com')});

      const result = await userRepository.find('notMe', 10, 1);

      expect(result).toHaveLength(0);
    });

    it('should find a user by first name', async () => {
      const user = await create('user', {name: 'John Doe'});

      const result = await userRepository.find('John', 10, 1);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(user.id);
    });

    it('should find a user by last name', async () => {
      const user = await create('user', {name: 'John Doe'});

      const result = await userRepository.find('Doe', 10, 1);

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
