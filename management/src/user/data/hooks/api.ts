import {FindUsersResponseBodyDto, ListUserClientSessionResponseBodyDto} from '@prowire-vpn/api';
import {useQuery, UseQueryOptions} from 'react-query';
import {findUsers, listUserClientSessions} from 'user/data/api';

export function useFindUsers(
  search: string,
  options?: Omit<UseQueryOptions<FindUsersResponseBodyDto>, 'queryKey' | 'queryFn'>,
) {
  return useQuery(['find-users', search], findUsers, options);
}

export function useListUserClientSessions(
  userId: string,
  options?: Omit<UseQueryOptions<ListUserClientSessionResponseBodyDto>, 'queryKey' | 'queryFn'>,
) {
  return useQuery(['list-user-client-sessions', userId], listUserClientSessions, options);
}
