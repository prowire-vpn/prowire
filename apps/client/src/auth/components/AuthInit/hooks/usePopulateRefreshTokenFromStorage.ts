import {useGetRefreshToken} from 'auth/data';
import {useAuthDispatch, useAuth} from 'auth/state';

export function usePopulateRefreshTokenFromStorage() {
  const {refreshToken} = useAuth();
  const dispatch = useAuthDispatch();
  useGetRefreshToken({
    enabled: !refreshToken,
    refetchInterval: false,
    suspense: true,
    onSuccess: (token) => {
      if (token) {
        dispatch({type: 'setRefreshToken', payload: token});
      }
    },
  });
}
