import {AuthController} from './auth.controller';
import {
  AccessTokenService,
  RefreshTokenService,
  OAuthService,
  Client,
  AccessToken,
  RefreshToken,
} from 'auth/domain';
import {Test} from '@nestjs/testing';
import {build} from 'test';
import {faker} from '@faker-js/faker';
import {Response} from 'express';
import {ConfigService} from '@nestjs/config';
import {User, UserService} from 'organization/domain';

describe('AuthController', () => {
  let client: Client;
  let accessToken: AccessToken;
  let refreshToken: RefreshToken;
  let code: string;
  let codeVerifier: string;
  let user: User;

  let authController: AuthController;
  let mockAccessTokenService: Partial<AccessTokenService>;
  let mockRefreshTokenService: Partial<RefreshTokenService>;

  let mockResponse: Response;

  beforeEach(async () => {
    client = build('client');
    accessToken = build('accessToken', client);
    refreshToken = build('refreshToken', client);
    code = faker.datatype.uuid();
    codeVerifier = faker.datatype.uuid();
    user = build('user');

    mockAccessTokenService = {
      create: jest.fn().mockReturnValue(accessToken),
    };
    mockRefreshTokenService = {
      create: jest.fn().mockReturnValue(refreshToken),
    };

    class MockOAuthService {
      verifySessionCode = jest.fn().mockReturnValue(build('oauthSession', {userId: user.id, code}));
    }

    class MockUserService {
      get = jest.fn().mockReturnValue(user);
    }

    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AccessTokenService,
        RefreshTokenService,
        ConfigService,
        OAuthService,
        UserService,
      ],
    })
      .overrideProvider(AccessTokenService)
      .useValue(mockAccessTokenService)
      .overrideProvider(RefreshTokenService)
      .useValue(mockRefreshTokenService)
      .overrideProvider(OAuthService)
      .useClass(MockOAuthService)
      .overrideProvider(UserService)
      .useClass(MockUserService)
      .compile();

    authController = moduleRef.get<AuthController>(AuthController);

    mockResponse = {
      cookie: jest.fn(),
      send: jest.fn(),
    } as unknown as Response;
  });

  describe('token', () => {
    it('should return an access and refresh token', async () => {
      await authController.token(mockResponse, {code, code_verifier: codeVerifier});

      expect(mockResponse.send).toHaveBeenCalledWith({
        access_token: accessToken.toString(),
        refresh_token: refreshToken.toString(),
      });
    });

    it('should set a cookie with the refresh token', async () => {
      await authController.token(mockResponse, {code, code_verifier: codeVerifier});

      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'prowire_auth',
        JSON.stringify({
          refreshToken: refreshToken.toString(),
        }),
        expect.anything(),
      );
    });
  });
});
