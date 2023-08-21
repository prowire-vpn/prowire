import {Catch, UnauthorizedException, ArgumentsHost} from '@nestjs/common';
import {NoUserAccountForRefreshTokenError} from 'auth/domain';
import {BaseExceptionFilter} from '@nestjs/core';

@Catch(NoUserAccountForRefreshTokenError)
export class RefreshExceptionFilter extends BaseExceptionFilter {
  catch(error: NoUserAccountForRefreshTokenError, host: ArgumentsHost) {
    super.catch(new UnauthorizedException(), host);
  }
}
