import {AppHealthResponseBodyDto} from '@prowire-vpn/api';
import {client} from 'base/data';

export async function getHealth(baseURL?: string): Promise<AppHealthResponseBodyDto> {
  const {data} = await client.get<AppHealthResponseBodyDto>('/health', {
    baseURL,
    timeout: 3000,
  });
  return data;
}
