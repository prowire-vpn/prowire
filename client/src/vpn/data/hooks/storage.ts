import {
  useQuery,
  UseQueryOptions,
  useMutation,
  UseMutationOptions,
} from 'react-query';
import {KeyPair} from './native';
import {queryClient} from 'base/data';
import {getItem, storeItem, clearItem} from 'base/state/storage';

const KEY_PAIR_KEY = 'keyPair';
export const KEY_PAIR_CACHE_KEY = 'key_pair_local';

export function useGetKeyPair(
  options?: Omit<UseQueryOptions<KeyPair | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery(
    KEY_PAIR_CACHE_KEY,
    async () => {
      const item = await getItem(KEY_PAIR_KEY);
      if (!item) {
        return null;
      }
      return JSON.parse(item) as KeyPair;
    },
    options,
  );
}

export function useStoreKeyPair(
  options?: Omit<
    UseMutationOptions<void, unknown, KeyPair>,
    'queryKey' | 'queryFn'
  >,
) {
  return useMutation<void, unknown, KeyPair>(
    KEY_PAIR_CACHE_KEY,
    (item: KeyPair) => storeItem(KEY_PAIR_KEY, JSON.stringify(item)),
    options,
  );
}

export function useClearKeyPair(
  options?: Omit<
    UseMutationOptions<void, unknown, undefined>,
    'queryKey' | 'queryFn'
  >,
) {
  return useMutation<void, unknown, undefined>(() => clearItem(KEY_PAIR_KEY), {
    ...options,
    onSuccess: (...args) => {
      queryClient.removeQueries(KEY_PAIR_CACHE_KEY);
      options?.onSuccess?.(...args);
    },
  });
}
