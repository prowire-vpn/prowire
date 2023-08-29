import {
  DeleteUserResponseBodyDto,
  FindUsersResponseBodyDto,
  GetUserByIdResponseBodyDto,
  CreateUserResponseBodyDto,
  CreateUserRequestBodyDto,
} from '@prowire-vpn/api';
import {QueryFunctionContext} from 'react-query';
import {client} from 'base/data';

export async function deleteUser(id: string): Promise<DeleteUserResponseBodyDto> {
  const {data} = await client.delete<DeleteUserResponseBodyDto>(`/user/${id}`);
  return data;
}

export async function findUsers({
  queryKey,
}: QueryFunctionContext): Promise<FindUsersResponseBodyDto> {
  const search = queryKey[1] as string;
  const {data} = await client.get<FindUsersResponseBodyDto>(
    `/user?search=${encodeURIComponent(search)}`,
  );
  return data;
}

export async function getMe(): Promise<GetUserByIdResponseBodyDto> {
  const {data} = await client.get<GetUserByIdResponseBodyDto>('/user/me');
  return data;
}

export async function postUserGenerator(
  user: Omit<CreateUserRequestBodyDto, 'email'> & {email: string},
): Promise<CreateUserResponseBodyDto> {
  const {data} = await client.post<CreateUserResponseBodyDto>(`/user`, user);
  return data;
}
