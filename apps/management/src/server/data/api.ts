import {FindServerResponseBodyDto} from '@prowire-vpn/api';
import {client} from 'base/data';

export async function findServer(): Promise<FindServerResponseBodyDto> {
  const {data} = await client.get<FindServerResponseBodyDto>(`/server`);
  return data;
}
