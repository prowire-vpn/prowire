import {
  useQuery,
  UseQueryOptions,
  useMutation,
  UseMutationOptions,
} from 'react-query';
import {queryClient} from 'base/api/client';
import {getItem, storeItem, clearItem} from 'base/state/storage';

const REFRESH_TOKEN_KEY = 'refreshToken';
export const REFRESH_TOKEN_CACHE_KEY = 'refresh_token_local';

export function useGetRefreshToken(
  options?: Omit<UseQueryOptions<string | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery(
    REFRESH_TOKEN_CACHE_KEY,
    () => getItem(REFRESH_TOKEN_KEY),
    options,
  );
}

export function useStoreRefreshToken(
  options?: Omit<
    UseMutationOptions<void, unknown, string>,
    'queryKey' | 'queryFn'
  >,
) {
  return useMutation<void, unknown, string>(
    (item: string) => storeItem(REFRESH_TOKEN_KEY, item),
    options,
  );
}

export function useClearRefreshToken(
  options?: Omit<
    UseMutationOptions<void, unknown, undefined>,
    'queryKey' | 'queryFn'
  >,
) {
  return useMutation<void, unknown, undefined>(
    () => clearItem(REFRESH_TOKEN_KEY),
    {
      ...options,
      onSuccess: (...args) => {
        queryClient.removeQueries(REFRESH_TOKEN_CACHE_KEY);
        options?.onSuccess?.(...args);
      },
    },
  );
}
