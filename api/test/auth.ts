import {UserDocument} from 'organization/infrastructure/user.schema';
import {sign} from 'jsonwebtoken';

export function getAuthToken(user: UserDocument): string {
  return sign({admin: user.admin, sub: user._id}, process.env.ACCESS_TOKEN_SECRET as string);
}

export function getBearerAuth(user: UserDocument): string {
  return `Bearer ${getAuthToken(user)}`;
}
