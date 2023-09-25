import {AccessTokenService} from './access_token.service';
import {AccessTokenStrategy} from './access_token.strategy';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {Test} from '@nestjs/testing';
import {build} from 'test';
import {type AccessTokenPayload} from './access_token.entity.interface';

describe('AccessTokenStrategy', () => {
  let accessTokenStrategy: AccessTokenStrategy;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [AccessTokenStrategy, AccessTokenService, ConfigService],
    }).compile();

    accessTokenStrategy = moduleRef.get<AccessTokenStrategy>(AccessTokenStrategy);
  });

  describe('validate', () => {
    it('should validate a payload', () => {
      const client = build('client');
      const payload: AccessTokenPayload = {sub: client.id, admin: client.admin};

      const result = accessTokenStrategy.validate(payload);

      expect(result).toEqual(client);
    });

    it('should throw an error if the payload is invalid', () => {
      const payload = {invalid: 'not_correct'};

      expect(() => accessTokenStrategy.validate(payload)).toThrowError();
    });
  });
});
