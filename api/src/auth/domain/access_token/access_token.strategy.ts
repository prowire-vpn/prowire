import {ExtractJwt, Strategy} from 'passport-jwt';
import {PassportStrategy} from '@nestjs/passport';
import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {AccessToken} from './access_token.entity';
import {Client} from 'auth/domain/client.entity';
import {AccessTokenService} from './access_token.service';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private accessTokenService: AccessTokenService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('ACCESS_TOKEN_SECRET'),
      signOptions: accessTokenService.options,
    });
  }

  validate(payload: any): Client {
    const cleanPayload = AccessToken.verifyPayload(payload);
    return Client.fromAccessTokenPayload(cleanPayload);
  }
}
