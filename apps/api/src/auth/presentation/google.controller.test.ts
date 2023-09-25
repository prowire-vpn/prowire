import {GoogleController} from './google.controller';
import {
  AccessTokenService,
  RefreshTokenService,
  OAuthService,
  Client,
  AccessToken,
  RefreshToken,
  OAuthSession,
} from 'auth/domain';
import {Test} from '@nestjs/testing';
import {build} from 'test';
import {faker} from '@faker-js/faker';
import {type Response} from 'express';
import {ConfigService} from '@nestjs/config';

describe('GoogleController', () => {
  let client: Client;
  let accessToken: AccessToken;
  let refreshToken: RefreshToken;
  let state: string;
  let redirectUri: string;
  let session: OAuthSession;

  let googleController: GoogleController;
  let mockAccessTokenService: Partial<AccessTokenService>;
  let mockRefreshTokenService: Partial<RefreshTokenService>;

  let mockResponse: Response;

  beforeEach(async () => {
    client = build('client');
    accessToken = build('accessToken', client);
    refreshToken = build('refreshToken', client);
    state = faker.datatype.uuid();
    redirectUri = faker.internet.url();
    session = build('oauthSession', {code: 'code', state, redirect_uri: redirectUri});

    mockAccessTokenService = {
      create: jest.fn().mockReturnValue(accessToken),
    };
    mockRefreshTokenService = {
      create: jest.fn().mockReturnValue(refreshToken),
    };

    class MockOAuthService {
      issueOAuthSessionCode = jest.fn().mockReturnValue(session);
    }

    const moduleRef = await Test.createTestingModule({
      controllers: [GoogleController],
      providers: [AccessTokenService, RefreshTokenService, ConfigService, OAuthService],
    })
      .overrideProvider(AccessTokenService)
      .useValue(mockAccessTokenService)
      .overrideProvider(RefreshTokenService)
      .useValue(mockRefreshTokenService)
      .overrideProvider(OAuthService)
      .useClass(MockOAuthService)
      .compile();

    googleController = moduleRef.get<GoogleController>(GoogleController);

    mockResponse = {
      cookie: jest.fn(),
      redirect: jest.fn(),
    } as unknown as Response;
  });

  describe('redirect', () => {
    it('should redirect to session defined URL', async () => {
      await googleController.redirect(mockResponse, state, client);

      expect(mockResponse.redirect).toHaveBeenCalledWith(session.redirectionUrl);
    });
  });
});
