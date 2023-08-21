import {FindServerResponseBodyDto} from '@prowire-vpn/api';
import {Axios} from 'axios';

export async function findServerGenerator(axios: Axios): Promise<FindServerResponseBodyDto> {
  const {data} = await axios.get<string>(`/server`);
  return JSON.parse(data) as FindServerResponseBodyDto;
}
