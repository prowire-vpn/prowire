import {Test} from '@nestjs/testing';
import {OAuthService} from './oauth.service';
import {faker} from '@faker-js/faker';
import {build} from 'test';
import {User, UserService} from 'organization/domain';
import {EventEmitterModule, EventEmitter2} from '@nestjs/event-emitter';
import {GoogleIdentity} from './thirdPartyIdentity.entity';
import {
  NoRefreshTokenProvidedError,
  MissingDataForAccountCreationError,
} from './oauth.service.error';
import {OauthAuthenticatedEvent} from './oauth.events';
import {OAuthSessionRepository} from 'auth/infrastructure';

class MockOAuthSessionRepository {
  persist = jest.fn();
  find = jest.fn();
}

describe('OAuthService', () => {
  let user: User;

  let oAuthService: OAuthService;
  let mockUserService: Partial<UserService>;
  let mockEventEmitter: Partial<EventEmitter2>;

  beforeEach(async () => {
    user = build('user');

    mockUserService = {
      getByEmail: jest.fn(async () => user),
      getUserCount: jest.fn(async () => 0),
      register: jest.fn(async () => user),
    };

    mockEventEmitter = {
      emit: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      imports: [EventEmitterModule.forRoot()],
      providers: [OAuthService, UserService, EventEmitter2, OAuthSessionRepository],
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .overrideProvider(EventEmitter2)
      .useValue(mockEventEmitter)
      .overrideProvider(OAuthSessionRepository)
      .useClass(MockOAuthSessionRepository)
      .compile();

    oAuthService = moduleRef.get<OAuthService>(OAuthService);
  });

  describe('login', () => {
    it('should successfully return a user for an existing account', async () => {
      const authentication = new GoogleIdentity({
        email: user.email.toString(),
        accessToken: faker.datatype.uuid(),
        refreshToken: faker.datatype.uuid(),
      });

      await expect(oAuthService.login(authentication)).resolves.toEqual(user);
    });

    it('should emit an event on successful login', async () => {
      const authentication = new GoogleIdentity({
        email: user.email.toString(),
        accessToken: faker.datatype.uuid(),
        refreshToken: faker.datatype.uuid(),
      });

      await oAuthService.login(authentication);
      expect(mockEventEmitter.emit).toHaveBeenCalledWith(
        'auth.oauth.authenticated',
        new OauthAuthenticatedEvent(authentication, user),
      );
    });

    it('should throw an error if the user does not has a refresh token and does not have the identity provider', async () => {
      const authentication = new GoogleIdentity({
        email: user.email.toString(),
        accessToken: faker.datatype.uuid(),
      });

      await expect(oAuthService.login(authentication)).rejects.toThrowError(
        NoRefreshTokenProvidedError,
      );
    });

    it('should not throw an error if no refresh token is provided and the user has the identity provider', async () => {
      const authentication = new GoogleIdentity({
        email: user.email.toString(),
        accessToken: faker.datatype.uuid(),
      });
      user.addIdentity('google', {
        accessToken: faker.datatype.uuid(),
        refreshToken: faker.datatype.uuid(),
      });

      await expect(oAuthService.login(authentication)).resolves.toEqual(user);
    });

    it('should register the user as admin if it is not known and there are no other users', async () => {
      const authentication = new GoogleIdentity({
        email: user.email.toString(),
        accessToken: faker.datatype.uuid(),
        refreshToken: faker.datatype.uuid(),
        name: faker.name.fullName(),
      });

      mockUserService.getByEmail = jest.fn(async () => null);
      mockUserService.getUserCount = jest.fn(async () => 0);

      await expect(oAuthService.login(authentication)).resolves.toEqual(user);
      expect(mockUserService.register).toHaveBeenCalledWith(expect.objectContaining({admin: true}));
    });

    it('should return undefined if it is not known but there are other users', async () => {
      const authentication = new GoogleIdentity({
        email: user.email.toString(),
        accessToken: faker.datatype.uuid(),
        refreshToken: faker.datatype.uuid(),
        name: faker.name.fullName(),
      });

      mockUserService.getByEmail = jest.fn(async () => null);
      mockUserService.getUserCount = jest.fn(async () => 1);

      await expect(oAuthService.login(authentication)).resolves.toBeUndefined();
    });

    it('should throw an error if we are creating the first user but he lacks required refresh token', async () => {
      const authentication = new GoogleIdentity({
        email: user.email.toString(),
        accessToken: faker.datatype.uuid(),
        name: faker.name.fullName(),
      });

      mockUserService.getByEmail = jest.fn(async () => null);
      mockUserService.getUserCount = jest.fn(async () => 0);

      await expect(oAuthService.login(authentication)).rejects.toThrowError(
        NoRefreshTokenProvidedError,
      );
    });

    it('should throw an error if we are creating the first user but he lacks required name', async () => {
      const authentication = new GoogleIdentity({
        email: user.email.toString(),
        accessToken: faker.datatype.uuid(),
        refreshToken: faker.datatype.uuid(),
      });

      mockUserService.getByEmail = jest.fn(async () => null);
      mockUserService.getUserCount = jest.fn(async () => 0);

      await expect(oAuthService.login(authentication)).rejects.toThrowError(
        MissingDataForAccountCreationError,
      );
    });
  });
});
