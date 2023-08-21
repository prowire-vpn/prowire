import {ClientType, ClientConstructor} from './client.entity.interface';
import {User, UserId} from 'user/domain/user.entity';
import {AccessTokenPayload} from './access_token';

export class Client {
  type: ClientType = 'user';
  id: UserId;
  admin: boolean;

  constructor(init: ClientConstructor) {
    this.id = init.id;
    this.admin = init.admin;
  }

  public static fromUser(user: User): Client {
    return new Client({
      id: user.id,
      admin: user.admin,
    });
  }

  public static fromAccessTokenPayload(payload: AccessTokenPayload) {
    return new Client({
      id: payload.sub,
      admin: payload.admin,
    });
  }
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    class User extends Client {}
  }
}
