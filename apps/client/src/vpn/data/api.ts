import {ConnectServerResponseBodyDto} from '@prowire-vpn/api';
import {client} from 'base/data';

export async function postServerConnect(publicKey: string) {
  const {data} = await client.post<ConnectServerResponseBodyDto>('/server/connect', {publicKey});
  return data;
}
