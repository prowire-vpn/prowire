import {EmailAddress} from './email.entity';

export class EmailAlreadyRegisteredError extends Error {
  constructor(email: EmailAddress) {
    super(`Cannot create user with email ${email}, as it is already registered`);
  }
}

export class UserNotFoundError extends Error {
  constructor(id: string) {
    super(`Can not find user with ID "${id}"`);
  }
}
