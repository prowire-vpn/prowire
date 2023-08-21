import {GetUserByIdResponseBodyDto} from '@prowire-vpn/api';
import {Axios} from 'axios';

export async function getMeGenerator(axios: Axios): Promise<GetUserByIdResponseBodyDto> {
  const {data} = await axios.get<string>('/user/me');
  return JSON.parse(data) as GetUserByIdResponseBodyDto;
}
