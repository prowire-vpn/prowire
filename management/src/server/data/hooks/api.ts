import {FindServerResponseBodyDto} from '@prowire-vpn/api';
import {useQuery, UseQueryOptions} from 'react-query';
import {findServer} from 'server/data/api';

export function useFindServer(
  options?: Omit<UseQueryOptions<FindServerResponseBodyDto>, 'queryKey' | 'queryFn'>,
) {
  return useQuery('find-server', findServer, options);
}
