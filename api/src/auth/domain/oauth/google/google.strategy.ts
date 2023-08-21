import {PassportStrategy} from '@nestjs/passport';
import {Strategy, Profile, StrategyOptions} from 'passport-google-oauth20';
import {ConfigService} from '@nestjs/config';
import {Injectable, UnauthorizedException} from '@nestjs/common';
import {NoVerifiedEmailError} from './google.strategy.error';
import {GoogleOAuth} from 'auth/domain/oauth/oauth.entity';
import {OAuthService} from 'auth/domain/oauth/oauth.service';
import {Client} from 'auth/domain/client.entity';
import {StateStore} from 'auth/infrastructure';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService, private oAuthService: OAuthService) {
    const options: StrategyOptions = {
      clientID: configService.getOrThrow<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: `${configService.getOrThrow<string>('API_URL')}/auth/google/redirect`,
      scope: ['email', 'profile'],
      state: true,
      store: StateStore,
    };
    super(options);
  }

  public async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<Client> {
    const email = this.getProfileEmail(profile);
    if (!email) throw new NoVerifiedEmailError(profile);
    const authentication = new GoogleOAuth({
      email,
      accessToken,
      refreshToken,
      name: profile.displayName,
    });
    const user = await this.oAuthService.login(authentication);
    if (!user) throw new UnauthorizedException();
    return Client.fromUser(user);
  }

  private getProfileEmail(profile: Profile): string | undefined {
    return profile.emails?.find(({verified}) => verified == 'true')?.value;
  }
}
