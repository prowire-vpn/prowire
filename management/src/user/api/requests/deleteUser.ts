import {DeleteUserResponseBodyDto} from '@prowire-vpn/api';
import {Axios} from 'axios';

export async function deleteUserGenerator(
  axios: Axios,
  id: string,
): Promise<DeleteUserResponseBodyDto> {
  const {data} = await axios.delete<string>(`/user/${id}`);
  return JSON.parse(data) as DeleteUserResponseBodyDto;
}
