import {CreateUserRequestBodyDto, CreateUserResponseBodyDto} from '@prowire-vpn/api';
import {Axios} from 'axios';

export async function postUserGenerator(
  axios: Axios,
  user: Omit<CreateUserRequestBodyDto, 'email'> & {email: string},
): Promise<CreateUserResponseBodyDto> {
  console.log(user);
  const {data} = await axios.post<string>(`/user`, user);
  return JSON.parse(data) as CreateUserResponseBodyDto;
}
