import {Injectable, type CanActivate, type ExecutionContext} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {type Request} from 'express';

@Injectable()
export class ClientRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const admin = this.reflector.get<boolean>('admin', context.getHandler());
    if (!admin) {
      return true;
    }
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user;
    return user?.admin === true;
  }
}
