import {AppHealthResponseBodyDto} from '@prowire-vpn/api';
import {client} from 'base/api/client';

export async function getHealth(
  baseURL?: string,
): Promise<AppHealthResponseBodyDto> {
  const {data} = await client.get<AppHealthResponseBodyDto>('/health', {
    baseURL,
  });
  return data;
}
