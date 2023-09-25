import {useCallback} from 'react';
import {clearRefreshToken} from 'auth/data';
import {useAuthDispatch} from 'auth/state';

export function useLogout() {
  const dispatch = useAuthDispatch();
  return useCallback(() => {
    clearRefreshToken();
    dispatch({type: 'logout'});
  }, [dispatch]);
}
