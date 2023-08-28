import {
  RefreshTokenRequestBodyDto,
  RefreshTokenResponseBodyDto,
} from '@prowire-vpn/api';
import {Axios} from 'axios';

export async function postRefreshGenerator(
  client: Axios,
  body: RefreshTokenRequestBodyDto,
): Promise<RefreshTokenResponseBodyDto> {
  const {data} = await client.post<RefreshTokenResponseBodyDto>(
    '/auth/refresh',
    body,
  );
  return data;
}
