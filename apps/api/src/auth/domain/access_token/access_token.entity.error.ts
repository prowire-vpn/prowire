import {ValidationError} from 'joi';

export class InvalidAccessTokenPayloadError extends Error {
  constructor(error: ValidationError) {
    super(`Invalid token payload received: ${error.message}`);
  }
}
