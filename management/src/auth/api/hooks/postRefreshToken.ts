import {RefreshResponseBodyDto} from '@prowire-vpn/api';
import {useMutation, UseMutationOptions} from 'react-query';
import {postRefreshToken} from 'auth/api/requests';

export function usePostRefreshToken(
  options?: Omit<UseMutationOptions<RefreshResponseBodyDto>, 'mutationKey' | 'mutationFn'>,
) {
  return useMutation('refresh-token', postRefreshToken, options);
}
