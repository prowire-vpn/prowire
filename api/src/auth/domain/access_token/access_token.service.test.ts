import {AccessTokenService} from './access_token.service';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {Test} from '@nestjs/testing';
import {build} from 'test';
import {AccessToken} from './access_token.entity';
import {verify} from 'jsonwebtoken';

describe('AccessTokenService', () => {
  let accessTokenService: AccessTokenService;
  let configService: ConfigService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [AccessTokenService, ConfigService],
    }).compile();

    accessTokenService = moduleRef.get<AccessTokenService>(AccessTokenService);
    configService = moduleRef.get<ConfigService>(ConfigService);
  });

  describe('create', () => {
    it('should create an access token', () => {
      const client = build('client');

      const accessToken = accessTokenService.create(client);

      expect(accessToken).toBeInstanceOf(AccessToken);
      expect(accessToken.token).not.toBeUndefined();
    });

    it('should create a valid access token', () => {
      const client = build('client');
      const accessToken = accessTokenService.create(client);

      expect(() =>
        verify(
          accessToken.token,
          configService.getOrThrow('ACCESS_TOKEN_SECRET'),
          accessTokenService.options,
        ),
      ).not.toThrow();
    });
  });
});
