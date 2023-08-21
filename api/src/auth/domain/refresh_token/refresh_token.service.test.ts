import {RefreshTokenService} from './refresh_token.service';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {Test} from '@nestjs/testing';
import {build} from 'test';
import {User, UserService} from 'user/domain';
import {UnauthorizedException} from '@nestjs/common';
import {RefreshToken} from './refresh_token.entity';
import {NoUserAccountForRefreshTokenError} from './refresh_token.service.error';

describe('RefreshTokenService', () => {
  let user: User;

  let mockUserService: Partial<UserService>;
  let refreshTokenService: RefreshTokenService;

  beforeEach(async () => {
    user = build('user');
    mockUserService = {
      get: jest.fn(async () => user),
    };

    const moduleRef = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [RefreshTokenService, UserService, ConfigService],
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .compile();

    refreshTokenService = moduleRef.get<RefreshTokenService>(RefreshTokenService);
  });

  describe('verify', () => {
    it('should return a user if it exists and has a valid token', async () => {
      const client = build('client', {id: user.id});
      const token = new RefreshToken({client}, process.env.REFRESH_TOKEN_KEY_BASE64 as string);

      await expect(refreshTokenService.verify(token.token)).resolves.toEqual(client);
    });

    it('should throw an error is the user does not exist', async () => {
      const client = build('client');
      const token = new RefreshToken({client}, process.env.REFRESH_TOKEN_KEY_BASE64 as string);
      mockUserService.get = jest.fn(async () => null);

      await expect(refreshTokenService.verify(token.token)).rejects.toThrowError(
        NoUserAccountForRefreshTokenError,
      );
    });

    it('should throw an error if the refresh token is not valid', async () => {
      await expect(refreshTokenService.verify('invalid')).rejects.toThrowError(
        UnauthorizedException,
      );
    });
  });
});
