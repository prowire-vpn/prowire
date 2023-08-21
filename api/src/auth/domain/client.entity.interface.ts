import {UserId} from 'user/domain';

export type ClientType = 'user';

export interface ClientConstructor {
  id: UserId;
  admin: boolean;
}
