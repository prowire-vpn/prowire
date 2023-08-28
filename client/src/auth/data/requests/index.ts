import {
  AuthTokenRequestBodyDto,
  RefreshTokenRequestBodyDto,
} from '@prowire-vpn/api';
import {postRefreshGenerator} from './refresh';
import {postTokenGenerator} from './token';
import {client} from 'base/api/client';

export const postToken = async (data: AuthTokenRequestBodyDto) =>
  postTokenGenerator(client, data);

export const postRefresh = async (data: RefreshTokenRequestBodyDto) =>
  postRefreshGenerator(client, data);
