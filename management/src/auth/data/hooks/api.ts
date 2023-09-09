import {
  RefreshTokenResponseBodyDto,
  AuthTokenRequestBodyDto,
  AuthTokenResponseBodyDto,
} from '@prowire-vpn/api';
import {useQuery, UseQueryOptions} from 'react-query';
import {postRefresh, postToken} from 'auth/data/api';

export function usePostRefresh(
  refreshToken?: string,
  options?: Omit<
    UseQueryOptions<RefreshTokenResponseBodyDto, unknown, RefreshTokenResponseBodyDto>,
    'queryKey' | 'queryFn'
  >,
) {
  const key = ['refresh', refreshToken];
  return useQuery<RefreshTokenResponseBodyDto, unknown, RefreshTokenResponseBodyDto>(
    key,
    async () => postRefresh({refresh_token: refreshToken}),
    options,
  );
}

export function usePostToken(
  data: AuthTokenRequestBodyDto,
  options?: Omit<
    UseQueryOptions<AuthTokenResponseBodyDto, unknown, AuthTokenResponseBodyDto>,
    'queryKey' | 'queryFn'
  >,
) {
  const key = ['token', data.code, data.code_verifier];
  return useQuery<AuthTokenResponseBodyDto, unknown, AuthTokenResponseBodyDto>(
    key,
    async () => postToken(data),
    options,
  );
}
