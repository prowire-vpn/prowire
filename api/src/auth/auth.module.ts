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
import {GoogleController, RefreshTokenController, AuthController} from './presentation';
import {OrganizationModule} from 'organization';
import {OAuthSessionRepository, OAuthSessionClass, OAuthSessionSchema} from './infrastructure';
import {MongooseModule} from '@nestjs/mongoose';

@Module({
  imports: [
    OrganizationModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.getOrThrow<string>('ACCESS_TOKEN_SECRET'),
          signOptions: {},
        };
      },
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{name: OAuthSessionClass.name, schema: OAuthSessionSchema}]),
  ],
  controllers: [GoogleController, RefreshTokenController, AuthController],
  providers: [
    OAuthService,
    AccessTokenService,
    RefreshTokenService,
    GoogleStrategy,
    AccessTokenStrategy,
    RefreshTokenCookieStrategy,
    RefreshTokenBodyStrategy,
    OAuthSessionRepository,
  ],
})
export class AuthModule {}
