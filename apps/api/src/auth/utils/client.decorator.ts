import {createParamDecorator, type ExecutionContext} from '@nestjs/common';
import {type Request} from 'express';
import {Client as IClient} from 'auth/domain/client.entity';

export const Client = createParamDecorator((data: unknown, ctx: ExecutionContext): IClient => {
  const request = ctx.switchToHttp().getRequest<Request>();
  if (!request.user)
    throw new Error(
      'Client not present on request, did you forget to add an authentication guard ?',
    );
  return request.user;
});
