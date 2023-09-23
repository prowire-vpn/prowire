import {useQuery, type UseQueryOptions} from 'react-query';
import {getClientConfig, type GetClientConfigResponseBody} from 'base/data/api';

export function useGetClientConfig(
  options?: Omit<UseQueryOptions<GetClientConfigResponseBody>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<GetClientConfigResponseBody>('clientConfig', getClientConfig, options);
}
