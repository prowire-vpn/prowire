import {Module} from '@nestjs/common';
import {JwtModule} from '@nestjs/jwt';
import {ConfigService} from '@nestjs/config';
import {
  GoogleStrategy,
  OAuthService,
  AccessTokenService,
  AccessTokenStrategy,
  RefreshTokenService,
  RefreshTokenCookieStrategy,
  RefreshTokenBodyStrategy,
} from './domain';
import {GoogleController, RefreshTokenController} from './presentation';
import {UserModule} from 'user';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.getOrThrow<string>('ACCESS_TOKEN_SECRET'),
          signOptions: {},
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [GoogleController, RefreshTokenController],
  providers: [
    OAuthService,
    AccessTokenService,
    RefreshTokenService,
    GoogleStrategy,
    AccessTokenStrategy,
    RefreshTokenCookieStrategy,
    RefreshTokenBodyStrategy,
  ],
})
export class AuthModule {}
