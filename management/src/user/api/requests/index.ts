import {CreateUserRequestBodyDto} from '@prowire-vpn/api';
import {QueryFunctionContext} from 'react-query';
import {deleteUserGenerator} from './deleteUser';
import {findUsersGenerator} from './findUsers';
import {getMeGenerator} from './getMe';
import {postUserGenerator} from './postUser';
import {client} from 'base/data';

export const getMe = async () => getMeGenerator(client);
export const findUsers = async (context: QueryFunctionContext) =>
  findUsersGenerator(client, context);
export const deleteUser = async (id: string) => deleteUserGenerator(client, id);
export const postUser = async (user: Omit<CreateUserRequestBodyDto, 'email'> & {email: string}) =>
  postUserGenerator(client, user);
