import {useQuery, type UseQueryOptions} from 'react-query';
import {getRefreshToken, getState, getCodeVerifier} from 'auth/data/storage';

export const REFRESH_TOKEN_CACHE_KEY = 'refresh_token_local';
export const STATE_CACHE_KEY = 'state_local';
export const CODE_VERIFIER_CACHE_KEY = 'code_verifier_local';

export function useGetRefreshToken(
  options?: Omit<UseQueryOptions<string | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery(REFRESH_TOKEN_CACHE_KEY, getRefreshToken, options);
}

export function useGetState(
  options?: Omit<UseQueryOptions<string | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery(STATE_CACHE_KEY, getState, options);
}

export function useGetCodeVerifier(
  options?: Omit<UseQueryOptions<string | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery(CODE_VERIFIER_CACHE_KEY, getCodeVerifier, options);
}
