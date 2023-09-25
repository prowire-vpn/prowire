import {NotFoundException, BadRequestException, Catch, type ArgumentsHost} from '@nestjs/common';
import {BaseExceptionFilter} from '@nestjs/core';
import {EmailAlreadyRegisteredError, UserNotFoundError} from 'organization/domain';

@Catch(EmailAlreadyRegisteredError)
export class CreateUserExceptionFilter extends BaseExceptionFilter {
  catch(error: EmailAlreadyRegisteredError, host: ArgumentsHost) {
    const email = host.getArgByIndex(0)?.email;
    super.catch(new BadRequestException('already-exists', `User "${email}" already exists`), host);
  }
}

@Catch(UserNotFoundError)
export class UpdateUserExceptionFilter extends BaseExceptionFilter {
  catch(error: UserNotFoundError, host: ArgumentsHost) {
    const id = host.getArgByIndex(0);
    super.catch(new NotFoundException(undefined, `User "${id}" does not exist`), host);
  }
}

@Catch(UserNotFoundError)
export class DeleteUserExceptionFilter extends BaseExceptionFilter {
  catch(error: UserNotFoundError, host: ArgumentsHost) {
    const id = host.getArgByIndex(0);
    super.catch(new NotFoundException(undefined, `User "${id}" does not exist`), host);
  }
}
