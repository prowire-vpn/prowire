import {UserConstructor} from './user.entity';

export type RegisterUserInfo = Omit<UserConstructor, 'id'>;
