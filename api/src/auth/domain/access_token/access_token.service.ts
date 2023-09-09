import {ConfigService} from '@nestjs/config';
import {AccessToken} from './access_token.entity';
import {SignOptions} from 'jsonwebtoken';
import {Client} from 'auth/domain/client.entity';
import {Injectable} from '@nestjs/common';

@Injectable()
export class AccessTokenService {
  private secret: string;
  public options: SignOptions;

  constructor(private configService: ConfigService) {
    this.secret = configService.getOrThrow<string>('ACCESS_TOKEN_SECRET');
    this.options = {
      expiresIn: configService.get<string>('ACCESS_TOKEN_EXPIRATION', '1d'),
      issuer: configService.getOrThrow<string>('SERVER_ID'),
      audience: [configService.getOrThrow<string>('SERVER_ID')],
    };
  }

  public create(client: Client): AccessToken {
    return new AccessToken(client, this.secret, this.options);
  }
}
