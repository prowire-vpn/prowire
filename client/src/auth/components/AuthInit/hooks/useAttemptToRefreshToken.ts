import {usePostRefresh, useClearRefreshToken} from 'auth/data';
import {useAuth, useAuthDispatch} from 'auth/state';
import {isAuthError, getTokenExpiration} from 'auth/utils';
import {setAccessToken} from 'base/data';

export function useAttemptToRefreshToken() {
  const {refreshToken, accessToken} = useAuth();
  const dispatch = useAuthDispatch();

  const {mutate: clearRefreshToken} = useClearRefreshToken();
  usePostRefresh(refreshToken, {
    enabled: !!refreshToken,
    suspense: !accessToken,
    onSuccess(data) {
      if (!data.refresh_token) {
        throw new Error('No refresh token provided in refresh call');
      }
      setAccessToken(data.access_token);
      dispatch({
        type: 'finishFlow',
        payload: {
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
        },
      });
    },
    onError: err => {
      dispatch({type: 'error', payload: err});

      if (isAuthError(err)) {
        clearRefreshToken(undefined);
        dispatch({
          type: 'logout',
        });
      }
    },
    retry: (count, err) => !isAuthError(err),
    refetchIntervalInBackground: true,
    refetchInterval: data => {
      if (!data) {
        return false;
      }
      const interval = getTokenExpiration(data.access_token);
      return Math.max(interval, 0);
    },
  });
}
