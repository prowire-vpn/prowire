import {FindUsersResponseBodyDto} from '@prowire-vpn/api';
import {useQuery, UseQueryOptions} from 'react-query';
import {findUsers} from 'user/api/requests';

export function useFindUsers(
  search: string,
  options?: Omit<UseQueryOptions<FindUsersResponseBodyDto>, 'queryKey' | 'queryFn'>,
) {
  return useQuery(['find-users', search], findUsers, options);
}
