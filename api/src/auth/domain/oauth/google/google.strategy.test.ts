import {GoogleStrategy} from './google.strategy';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {Test} from '@nestjs/testing';
import {OAuthService} from 'auth/domain/oauth/oauth.service';
import {faker} from '@faker-js/faker';
import {Profile} from 'passport-google-oauth20';
import {build} from 'test';
import {EmailAddress, User} from 'organization/domain';
import {Client} from 'auth/domain/client.entity';
import {NoVerifiedEmailError, UserNotFoundError} from './google.strategy.error';

describe('GoogleStrategy', () => {
  let accessToken: string;
  let refreshToken: string;
  let profile: Profile;
  let user: User;

  let googleStrategy: GoogleStrategy;
  let mockOAuthService: Partial<OAuthService>;

  beforeEach(async () => {
    accessToken = faker.datatype.uuid();
    refreshToken = faker.datatype.uuid();
    const email = faker.internet.email();
    const name = faker.name.fullName();
    profile = {
      id: faker.datatype.uuid(),
      profileUrl: faker.internet.url(),
      provider: 'google',
      displayName: name,
      emails: [{value: email, verified: 'true'}],
      // We don't do any operations on thee fields so can have rubbish data
      _raw: faker.datatype.json(),
      _json: {} as unknown as Profile['_json'],
    };
    user = build('user', {name, email: new EmailAddress(email)});

    mockOAuthService = {
      login: jest.fn(async () => user),
    };

    const moduleRef = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [GoogleStrategy, OAuthService, ConfigService],
    })
      .overrideProvider(OAuthService)
      .useValue(mockOAuthService)
      .compile();

    googleStrategy = moduleRef.get<GoogleStrategy>(GoogleStrategy);
  });

  describe('validate', () => {
    it('should call OAuth service login on a user', async () => {
      await googleStrategy.validate(accessToken, refreshToken, profile);

      expect(mockOAuthService.login).toHaveBeenCalled();
    });

    it('should return a client', async () => {
      const result = await googleStrategy.validate(accessToken, refreshToken, profile);

      expect(result).toBeInstanceOf(Client);
      expect(result.id).toEqual(user.id);
    });

    it('should throw an error if the user has no verified email', async () => {
      profile.emails = [{value: faker.internet.email(), verified: 'false'}];

      await expect(
        googleStrategy.validate(accessToken, refreshToken, profile),
      ).rejects.toThrowError(NoVerifiedEmailError);
    });

    it('should throw an error if the user has no email', async () => {
      profile.emails = [];

      await expect(
        googleStrategy.validate(accessToken, refreshToken, profile),
      ).rejects.toThrowError(NoVerifiedEmailError);
    });

    it('should throw an error if the OAuth service does not return a user', async () => {
      mockOAuthService.login = jest.fn(async () => undefined);

      await expect(
        googleStrategy.validate(accessToken, refreshToken, profile),
      ).rejects.toThrowError(UserNotFoundError);
    });
  });
});
