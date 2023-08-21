import {useQuery, UseQueryOptions} from 'react-query';
import {getClientConfig, GetClientConfigResponseBody} from 'base/api/requests';

export function useGetClientConfig(
  options?: Omit<UseQueryOptions<GetClientConfigResponseBody>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<GetClientConfigResponseBody>('clientConfig', getClientConfig, options);
}
