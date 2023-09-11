import {CanActivate, ExecutionContext, BadRequestException, Injectable} from '@nestjs/common';
import {AuthGuard, IAuthModuleOptions} from '@nestjs/passport';
import {Observable} from 'rxjs';
import {validateSync} from 'class-validator';
import {StartGoogleFlowQueryDto} from 'auth/presentation/google.controller.dto';
import {plainToClass} from 'class-transformer';
import {OAuthService} from 'auth/domain/oauth/oauth.service';
import {StateStore} from 'auth/infrastructure/StateStore';
import {ConfigService} from '@nestjs/config';

@Injectable()
export class GoogleOAuthGuard extends AuthGuard('google') implements CanActivate {
  constructor(
    protected readonly oAuthService: OAuthService,
    protected readonly configService: ConfigService,
  ) {
    super({
      accessType: 'offline',
    });
  }
}

@Injectable()
export class GoogleOAuthGuardInit extends GoogleOAuthGuard {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const query = plainToClass(StartGoogleFlowQueryDto, request.query);
    const errors = validateSync(query);
    if (errors.length)
      throw new BadRequestException({error: errors.map(({constraints}) => constraints)});

    const allowedRedirectUris = this.configService.getOrThrow<Array<string>>(
      'AUTHORIZED_REDIRECT_URIS',
    );
    if (!allowedRedirectUris.includes(query.redirect_uri)) throw new Error();

    StateStore.addState(query.state, query.redirect_uri);
    this.oAuthService.startOAuthSession(query);
    return super.canActivate(context);
  }

  getAuthenticateOptions(context: ExecutionContext): IAuthModuleOptions<any> | undefined {
    const request = context.switchToHttp().getRequest();
    const state = request.query.state;

    return {...super.getAuthenticateOptions(context), state};
  }
}

@Injectable()
export class GoogleOAuthGuardForceRefresh extends GoogleOAuthGuardInit {
  getAuthenticateOptions(context: ExecutionContext): IAuthModuleOptions<any> | undefined {
    return {...super.getAuthenticateOptions(context), prompt: 'consent'};
  }
}
