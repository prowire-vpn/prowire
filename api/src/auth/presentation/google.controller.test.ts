import {GoogleController} from './google.controller';
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

describe('GoogleController', () => {
  let client: Client;
  let accessToken: AccessToken;
  let encodedAccessToken: string;
  let refreshToken: RefreshToken;
  let encodedRefreshToken: string;
  let state: string;
  let encodedState: string;
  let desktopState: string;
  let encodedDesktopState: string;

  let googleController: GoogleController;
  let mockAccessTokenService: Partial<AccessTokenService>;
  let mockRefreshTokenService: Partial<RefreshTokenService>;

  let mockResponse: Response;

  beforeEach(async () => {
    client = build('client');
    accessToken = build('accessToken', client);
    encodedAccessToken = encodeURIComponent(accessToken.token);
    refreshToken = build('refreshToken', client);
    encodedRefreshToken = encodeURIComponent(refreshToken.token);
    state = faker.datatype.uuid();
    encodedState = encodeURIComponent(state);
    desktopState = `desktop:${state}`;
    encodedDesktopState = encodeURIComponent(desktopState);

    mockAccessTokenService = {
      create: jest.fn().mockReturnValue(accessToken),
    };
    mockRefreshTokenService = {
      create: jest.fn().mockReturnValue(refreshToken),
    };

    class MockOAuthService {
      issueOAuthSessionCode = jest.fn().mockReturnValue(build('oauthSession', {code: 'code'}));
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
      send: jest.fn(),
      redirect: jest.fn(),
    } as unknown as Response;
  });

  describe('redirect', () => {
    it('should redirect to admin panel', async () => {
      googleController.redirect(mockResponse, state, client);

      expect(mockResponse.redirect).toHaveBeenCalledWith(
        expect.stringContaining(process.env.ADMIN_PANEL_URL as string),
      );
      expect(mockResponse.send).not.toHaveBeenCalled();
    });

    it('should send a HTML document with app deep link if the client is a desktop', async () => {
      googleController.redirect(mockResponse, desktopState, client);

      expect(mockResponse.send).toHaveBeenCalledWith(expect.stringContaining('prowire://'));
      expect(mockResponse.redirect).not.toHaveBeenCalled();
    });

    it('should include state and access token in redirect', async () => {
      googleController.redirect(mockResponse, state, client);

      expect(mockResponse.redirect).toHaveBeenCalledWith(
        expect.stringContaining(`state=${encodedState}`),
      );
      expect(mockResponse.redirect).toHaveBeenCalledWith(
        expect.stringContaining(`accessToken=${encodedAccessToken}`),
      );
    });

    it('should include state and access token in HTML document if the client is a desktop', async () => {
      googleController.redirect(mockResponse, desktopState, client);

      expect(mockResponse.send).toHaveBeenCalledWith(
        expect.stringContaining(`state=${encodedDesktopState}`),
      );
      expect(mockResponse.send).toHaveBeenCalledWith(
        expect.stringContaining(`accessToken=${encodedAccessToken}`),
      );
    });

    it('should not include refresh token in redirect', async () => {
      googleController.redirect(mockResponse, state, client);

      expect(mockResponse.redirect).not.toHaveBeenCalledWith(
        expect.stringContaining('refreshToken'),
      );
    });

    it('should include refresh token in HTML document if the client is a desktop', async () => {
      googleController.redirect(mockResponse, desktopState, client);

      expect(mockResponse.send).toHaveBeenCalledWith(
        expect.stringContaining(`refreshToken=${encodedRefreshToken}`),
      );
    });

    it('should set a cookie with the refresh token', async () => {
      googleController.redirect(mockResponse, state, client);

      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'prowire_auth',
        JSON.stringify({
          refreshToken: refreshToken.token,
        }),
        expect.anything(),
      );
    });

    it('should not set a cookie with the refresh token if the client is a desktop', async () => {
      googleController.redirect(mockResponse, desktopState, client);

      expect(mockResponse.cookie).not.toHaveBeenCalled();
    });
  });
});
