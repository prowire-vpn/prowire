import {RefreshTokenController} from './refresh_token.controller';
import {AccessTokenService, Client, AccessToken, RefreshToken} from 'auth/domain';
import {Test} from '@nestjs/testing';
import {build} from 'test';
import {type Request, type Response} from 'express';

describe('RefreshTokenController', () => {
  let client: Client;
  let accessToken: AccessToken;
  let refreshToken: RefreshToken;

  let refreshTokenController: RefreshTokenController;
  let mockAccessTokenService: Partial<AccessTokenService>;

  let mockResponse: Response;
  let mockRequest: Request;

  beforeEach(async () => {
    client = build('client');
    accessToken = build('accessToken', client);
    refreshToken = build('refreshToken', client);

    mockAccessTokenService = {
      create: jest.fn().mockReturnValue(accessToken),
    };

    const moduleRef = await Test.createTestingModule({
      controllers: [RefreshTokenController],
      providers: [AccessTokenService],
    })
      .overrideProvider(AccessTokenService)
      .useValue(mockAccessTokenService)

      .compile();

    refreshTokenController = moduleRef.get<RefreshTokenController>(RefreshTokenController);

    mockResponse = {
      cookie: jest.fn(),
      json: jest.fn(),
    } as unknown as Response;
    mockRequest = {
      cookies: {},
    } as unknown as Request;
  });

  describe('refresh', () => {
    it('should return a new access token (refresh token provided in body)', async () => {
      await refreshTokenController.refresh(mockRequest, mockResponse, client, {
        refresh_token: refreshToken.token,
      });

      expect(mockResponse.json).toHaveBeenCalledTimes(1);
      expect(mockResponse.json).toHaveBeenCalledWith({
        access_token: accessToken.token,
        refresh_token: refreshToken.token,
      });
    });

    it('should return a new access token (refresh token provided in cookie)', async () => {
      mockRequest.cookies.prowire_auth = JSON.stringify({refreshToken: refreshToken.token});

      await refreshTokenController.refresh(mockRequest, mockResponse, client, {});

      expect(mockResponse.json).toHaveBeenCalledTimes(1);
      expect(mockResponse.json).toHaveBeenCalledWith({
        access_token: accessToken.token,
        refresh_token: refreshToken.token,
      });
    });

    it('should not renew cookies when refresh token provided in body', async () => {
      await refreshTokenController.refresh(mockRequest, mockResponse, client, {
        refresh_token: refreshToken.token,
      });

      expect(mockResponse.cookie).not.toHaveBeenCalled();
    });

    it('should renew cookies when refresh token provided in cookie', async () => {
      const cookie = JSON.stringify({refreshToken: refreshToken.token});
      mockRequest.cookies.prowire_auth = cookie;

      await refreshTokenController.refresh(mockRequest, mockResponse, client, {});

      expect(mockResponse.cookie).toHaveBeenCalledTimes(1);
      expect(mockResponse.cookie).toHaveBeenCalledWith('prowire_auth', cookie, expect.anything());
    });
  });
});
