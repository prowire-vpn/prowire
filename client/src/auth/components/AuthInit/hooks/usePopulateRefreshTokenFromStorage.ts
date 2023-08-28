import {useEffect} from 'react';
import {useGetRefreshToken} from 'auth/data';
import {useAuthDispatch, useAuth} from 'auth/state';

export function usePopulateRefreshTokenFromStorage() {
  const {refreshToken} = useAuth();
  const dispatch = useAuthDispatch();
  const {data: storedRefreshToken} = useGetRefreshToken({
    enabled: !refreshToken,
    refetchInterval: false,
    suspense: true,
  });

  useEffect(() => {
    if (storedRefreshToken) {
      dispatch({type: 'setRefreshToken', payload: storedRefreshToken});
    }
  }, [dispatch, storedRefreshToken]);
}
