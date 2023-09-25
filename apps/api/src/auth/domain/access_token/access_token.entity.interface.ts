import {type SignOptions} from 'jsonwebtoken';

export interface AccessTokenPayload {
  admin: boolean;
  sub: string;
}

export type AccessTokenOptions = Omit<SignOptions, 'subject' | 'algorithm'>;
