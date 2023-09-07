import {BadRequestException, UnauthorizedException, Catch, ArgumentsHost} from '@nestjs/common';
import {
  NoVerifiedEmailError,
  NoRefreshTokenProvidedError,
  MissingDataForAccountCreationError,
  InvalidStateError,
  CodeAlreadyIssuedError,
  UserNotFoundError,
  UnauthorizedRedirectUri,
} from 'auth/domain';
import {ClientError} from 'app/domain';
import {StateNotFoundError, StateAlreadyExistsError} from 'auth/infrastructure';
import {Request, Response} from 'express';
import {BaseExceptionFilter} from '@nestjs/core';

@Catch(StateAlreadyExistsError)
export class StartExceptionFilter extends BaseExceptionFilter {
  catch(error: StateAlreadyExistsError, host: ArgumentsHost): void {
    const httpHost = host.switchToHttp();
    const response = httpHost.getResponse<Response>();
    const request = httpHost.getRequest<Request>();
    const redirectUri = request.query.redirect_uri;
    if (typeof redirectUri !== 'string')
      return super.catch(
        new BadRequestException('no-redirect_uri', 'No redirect_uri provided'),
        host,
      );
    const url = new URL(redirectUri);
    url.searchParams.append('error', 'state-already-exists');
    response.redirect(url.toString());
  }
}

@Catch(
  NoVerifiedEmailError,
  NoRefreshTokenProvidedError,
  MissingDataForAccountCreationError,
  InvalidStateError,
  CodeAlreadyIssuedError,
  UserNotFoundError,
  StateNotFoundError,
  UnauthorizedRedirectUri,
)
export class RedirectExceptionFilter extends BaseExceptionFilter {
  catch(
    error:
      | NoVerifiedEmailError
      | NoRefreshTokenProvidedError
      | MissingDataForAccountCreationError
      | InvalidStateError
      | CodeAlreadyIssuedError
      | UserNotFoundError
      | StateNotFoundError
      | UnauthorizedRedirectUri,
    host: ArgumentsHost,
  ): void {
    const httpHost = host.switchToHttp();
    const response = httpHost.getResponse<Response>();
    const request = httpHost.getRequest<Request>();

    let errorMsg = 'unauthorized';

    if (error instanceof ClientError) {
      errorMsg = error.errorCode;
    }

    const redirectUri = request.query.client_redirect_uri;
    if (typeof redirectUri === 'string') {
      const url = new URL(redirectUri);
      url.searchParams.append('error', errorMsg);
      url.searchParams.append('provider', 'google');
      return response.redirect(url.toString());
    }

    if (error instanceof ClientError) {
      return super.catch(new BadRequestException(errorMsg, error.message), host);
    }
    return super.catch(new UnauthorizedException(errorMsg, error.message), host);
  }
}
