import {RefreshResponseBodyDto} from '@prowire-vpn/api';
import {Axios} from 'axios';

export async function postRefreshTokenGenerator(axios: Axios): Promise<RefreshResponseBodyDto> {
  const {data} = await axios.post<string>('auth/refresh');
  return JSON.parse(data) as RefreshResponseBodyDto;
}
