import {Client} from 'auth/domain/client.entity';
import {RefreshToken} from './refresh_token.entity';
import {ConfigService} from '@nestjs/config';
import {UserService} from 'organization/domain';
import {NoUserAccountForRefreshTokenError} from './refresh_token.service.error';
import {Injectable, UnauthorizedException} from '@nestjs/common';

@Injectable()
export class RefreshTokenService {
  key: string;
  constructor(private configService: ConfigService, private userService: UserService) {
    this.key = this.configService.getOrThrow<string>('REFRESH_TOKEN_KEY_BASE64');
  }

  create(client: Client): RefreshToken {
    return new RefreshToken({client}, this.key);
  }

  async verify(token: string): Promise<Client> {
    const refreshToken = this.readTokenOrThrow(token);
    const user = await this.userService.get(refreshToken.subject);
    if (!user) throw new NoUserAccountForRefreshTokenError(refreshToken);
    return new Client(user);
  }

  private readTokenOrThrow(token: string): RefreshToken {
    try {
      return new RefreshToken({token}, this.key);
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
