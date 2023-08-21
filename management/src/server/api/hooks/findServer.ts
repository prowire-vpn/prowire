import {FindServerResponseBodyDto} from '@prowire-vpn/api';
import {useQuery, UseQueryOptions} from 'react-query';
import {findServer} from 'server/api/requests';

export function useFindServer(
  options?: Omit<UseQueryOptions<FindServerResponseBodyDto>, 'queryKey' | 'queryFn'>,
) {
  return useQuery('find-server', findServer, options);
}
