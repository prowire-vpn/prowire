import {BadRequestException, Catch, ArgumentsHost} from '@nestjs/common';
import {
  NoVerifiedEmailError,
  NoRefreshTokenProvidedError,
  MissingDataForAccountCreationError,
} from 'auth/domain';
import {Response} from 'express';
import {BaseExceptionFilter} from '@nestjs/core';

@Catch(NoVerifiedEmailError, NoRefreshTokenProvidedError, MissingDataForAccountCreationError)
export class RedirectExceptionFilter extends BaseExceptionFilter {
  catch(
    error: NoVerifiedEmailError | NoRefreshTokenProvidedError | MissingDataForAccountCreationError,
    host: ArgumentsHost,
  ): void {
    if (error instanceof NoVerifiedEmailError)
      return super.catch(
        new BadRequestException('no-email', `Google account has no verified email linked`),
        host,
      );

    host.switchToHttp().getResponse<Response>().redirect('/auth/google/force-refresh');
  }
}
