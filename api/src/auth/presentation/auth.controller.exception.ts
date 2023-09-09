import {UnauthorizedException, Catch, ArgumentsHost} from '@nestjs/common';
import {InvalidCodeError, FailedCodeChallengeError} from 'auth/domain';
import {BaseExceptionFilter} from '@nestjs/core';

@Catch(InvalidCodeError, FailedCodeChallengeError)
export class TokenExceptionFilter extends BaseExceptionFilter {
  catch(error: InvalidCodeError | FailedCodeChallengeError, host: ArgumentsHost): void {
    super.catch(new UnauthorizedException(), host);
  }
}
