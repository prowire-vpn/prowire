import {useQuery, UseQueryOptions} from 'react-query';
import {getHealth, GetHealthResponseBody} from 'config/api/requests';

export function useGetHealth(
  options?: Omit<
    UseQueryOptions<GetHealthResponseBody>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery<GetHealthResponseBody>('clientConfig', getHealth, options);
}
