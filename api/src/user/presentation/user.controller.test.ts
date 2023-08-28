import {UserController} from './user.controller';
import {User, UserService} from 'user/domain';
import {Test} from '@nestjs/testing';
import {build} from 'test';
import {Client} from 'auth/domain';
import {faker} from '@faker-js/faker';
import {ForbiddenException} from '@nestjs/common';

describe('UserController', () => {
  let user: User;
  let client: Client;

  let userController: UserController;
  let mockUserService: Partial<UserService>;

  beforeEach(async () => {
    user = build('user');
    client = build('client');

    mockUserService = {
      find: jest.fn().mockReturnValue(user),
      register: jest.fn().mockReturnValue(user),
      get: jest.fn().mockReturnValue(user),
      update: jest.fn().mockReturnValue(user),
      delete: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .compile();

    userController = moduleRef.get<UserController>(UserController);
  });

  describe('getUserById', () => {
    it('should allow user to fetch himself', async () => {
      await userController.getUserById('me', client);

      expect(mockUserService.get).toHaveBeenCalledWith(client.id);
    });

    it('should throw an error if non-admin attempts to load other user', async () => {
      const promise = userController.getUserById(faker.datatype.uuid(), client);

      expect(promise).rejects.toThrowError(ForbiddenException);
    });

    it('should allow admin to fetch another user', async () => {
      client = build('client', {admin: true});
      const id = faker.datatype.uuid();

      await userController.getUserById(id, client);

      expect(mockUserService.get).toHaveBeenCalledWith(id);
    });
  });
});
