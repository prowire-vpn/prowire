import {
  AuthTokenRequestBodyDto,
  type AuthTokenResponseBodyDto,
  RefreshTokenRequestBodyDto,
  type RefreshTokenResponseBodyDto,
} from '@prowire-vpn/api';
import {client} from 'base/data';

export async function postToken(
  body: AuthTokenRequestBodyDto,
): Promise<RefreshTokenResponseBodyDto> {
  const {data} = await client.post<RefreshTokenResponseBodyDto>('/auth/token', body);
  return data;
}

export async function postRefresh(
  body: RefreshTokenRequestBodyDto,
): Promise<AuthTokenResponseBodyDto> {
  const {data} = await client.post<AuthTokenResponseBodyDto>('/auth/refresh', body);
  return data;
}
