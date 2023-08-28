import {
  useQuery,
  UseQueryOptions,
  useMutation,
  UseMutationOptions,
} from 'react-query';
import {queryClient} from 'base/api/client';
import {getItem, storeItem, clearItem} from 'base/state/storage';

const API_URL_KEY = 'apiUrl';
export const API_URL_CACHE_KEY = 'api_url_local';

export function useGetApiUrl(
  options?: Omit<UseQueryOptions<string | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery(API_URL_CACHE_KEY, () => getItem(API_URL_KEY), options);
}

export function useStoreApiUrl(
  options?: Omit<
    UseMutationOptions<void, unknown, string>,
    'queryKey' | 'queryFn'
  >,
) {
  return useMutation<void, unknown, string>(
    (item: string) => storeItem(API_URL_KEY, item),
    options,
  );
}

export function useClearApiUrl(
  options?: Omit<
    UseMutationOptions<void, unknown, undefined>,
    'queryKey' | 'queryFn'
  >,
) {
  return useMutation<void, unknown, undefined>(() => clearItem(API_URL_KEY), {
    ...options,
    onSuccess: (...args) => {
      queryClient.removeQueries(API_URL_CACHE_KEY);
      options?.onSuccess?.(...args);
    },
  });
}
