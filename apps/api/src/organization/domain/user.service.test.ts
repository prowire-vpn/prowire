import {Test} from '@nestjs/testing';
import {UserService} from './user.service';
import {EmailAlreadyRegisteredError} from './user.service.error';
import {UserRepository} from 'organization/infrastructure';
import {faker} from '@faker-js/faker';
import {build} from 'test/factory';
import {EmailAddress} from './email.entity';

class MockUserRepository {
  persist = jest.fn();
  findByEmail = jest.fn();
}

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [],
      providers: [UserService, UserRepository],
    })
      .overrideProvider(UserRepository)
      .useClass(MockUserRepository)
      .compile();

    userService = moduleRef.get<UserService>(UserService);
    userRepository = moduleRef.get<UserRepository>(UserRepository);
  });

  describe('register', () => {
    it('should throw an error when a user with same email already exists', async () => {
      const name = faker.name.fullName();
      const email = new EmailAddress(faker.internet.email());
      const user = build('user', {email});

      userRepository.findByEmail = async () => user;

      await expect(userService.register({name, email})).rejects.toThrow(
        EmailAlreadyRegisteredError,
      );
    });

    it('should register a user', async () => {
      const name = faker.name.fullName();
      const email = new EmailAddress(faker.internet.email());

      userRepository.findByEmail = async () => null;

      const result = await userService.register({name, email});

      expect(userRepository.persist).toHaveBeenCalled;
      expect(result.name).toBe(name);
      expect(result.email).toBe(email);
    });
  });
});
