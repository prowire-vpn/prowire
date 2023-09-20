import {FindUsersResponseBodyDto, ListUserClientSessionResponseBodyDto} from '@prowire-vpn/api';
import {useQuery, UseQueryOptions} from 'react-query';
import {findUsers, listUserClientSessions} from 'user/data/api';
import {UserClientSession} from 'user/data/models';

export function useFindUsers(
  search: string,
  options?: Omit<UseQueryOptions<FindUsersResponseBodyDto>, 'queryKey' | 'queryFn'>,
) {
  return useQuery(['find-users', search], findUsers, options);
}

export type UseListUserClientSessionsResult = Omit<
  ListUserClientSessionResponseBodyDto,
  'sessions'
> & {sessions: Array<UserClientSession>};

export function useListUserClientSessions(
  userId: string,
  options?: Omit<
    UseQueryOptions<ListUserClientSessionResponseBodyDto, unknown, UseListUserClientSessionsResult>,
    'queryKey' | 'queryFn' | 'select'
  >,
) {
  return useQuery<ListUserClientSessionResponseBodyDto, unknown, UseListUserClientSessionsResult>(
    ['list-user-client-sessions', userId],
    listUserClientSessions,
    {
      ...options,
      select: (data) => ({
        ...data,
        sessions: data.sessions.map((session) => new UserClientSession(session)),
      }),
    },
  );
}
