import {FindUsersResponseBodyDto} from '@prowire-vpn/api';
import {Axios} from 'axios';
import {QueryFunctionContext} from 'react-query';

export async function findUsersGenerator(
  axios: Axios,
  {queryKey}: QueryFunctionContext,
): Promise<FindUsersResponseBodyDto> {
  const search = queryKey[1] as string;
  const {data} = await axios.get<string>(`/user?search=${encodeURIComponent(search)}`);
  return JSON.parse(data) as FindUsersResponseBodyDto;
}
