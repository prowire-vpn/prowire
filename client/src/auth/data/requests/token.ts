import {
  AuthTokenRequestBodyDto,
  AuthTokenResponseBodyDto,
} from '@prowire-vpn/api';
import {Axios} from 'axios';

export async function postTokenGenerator(
  client: Axios,
  body: AuthTokenRequestBodyDto,
): Promise<AuthTokenResponseBodyDto> {
  const {data} = await client.post<AuthTokenResponseBodyDto>(
    '/auth/token',
    body,
  );
  return data;
}
