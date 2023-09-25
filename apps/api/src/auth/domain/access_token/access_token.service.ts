import {ConfigService} from '@nestjs/config';
import {AccessToken} from './access_token.entity';
import {type SignOptions} from 'jsonwebtoken';
import {Client} from 'auth/domain/client.entity';
import {Injectable} from '@nestjs/common';

@Injectable()
export class AccessTokenService {
  private secret: string;
  public options: SignOptions;

  constructor(private configService: ConfigService) {
    const serverId = configService.get<string>('SERVER_ID');
    this.secret = configService.getOrThrow<string>('ACCESS_TOKEN_SECRET');
    this.options = {
      expiresIn: configService.get<string>('ACCESS_TOKEN_EXPIRATION', '1d'),
      issuer: serverId,
      audience: serverId ? [serverId] : undefined,
    };
  }

  public create(client: Client): AccessToken {
    return new AccessToken(client, this.secret, this.options);
  }
}
