import {CreateUserRequestBodyDto} from '@prowire-vpn/api';
import {QueryFunctionContext} from 'react-query';
import {deleteUserGenerator} from './deleteUser';
import {findUsersGenerator} from './findUsers';
import {getMeGenerator} from './getMe';
import {postUserGenerator} from './postUser';
import {axios} from 'base/api';

export const getMe = async () => getMeGenerator(axios);
export const findUsers = async (context: QueryFunctionContext) =>
  findUsersGenerator(axios, context);
export const deleteUser = async (id: string) => deleteUserGenerator(axios, id);
export const postUser = async (user: Omit<CreateUserRequestBodyDto, 'email'> & {email: string}) =>
  postUserGenerator(axios, user);
