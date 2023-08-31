import {Catch, UnauthorizedException, ArgumentsHost} from '@nestjs/common';
import {
  NoUserAccountForRefreshTokenError,
  InvalidRefreshTokenError,
  RefreshTokenNotProvidedError,
} from 'auth/domain';
import {BaseExceptionFilter} from '@nestjs/core';

@Catch(NoUserAccountForRefreshTokenError, InvalidRefreshTokenError, RefreshTokenNotProvidedError)
export class RefreshExceptionFilter extends BaseExceptionFilter {
  catch(
    error:
      | NoUserAccountForRefreshTokenError
      | InvalidRefreshTokenError
      | RefreshTokenNotProvidedError,
    host: ArgumentsHost,
  ) {
    super.catch(new UnauthorizedException(), host);
  }
}
