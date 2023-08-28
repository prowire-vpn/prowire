import * as React from 'react';
import {useCallback} from 'react';
import {Button} from './LogoutButton.style';
import {useClearRefreshToken} from 'auth/data';
import {useAuthDispatch} from 'auth/state';

export function LogoutButton() {
  const dispatch = useAuthDispatch();
  const {mutate} = useClearRefreshToken({
    onSuccess: () => {
      dispatch({type: 'logout'});
    },
  });

  const onPress = useCallback(() => {
    mutate(undefined);
  }, [mutate]);

  return <Button onPress={onPress}>Logout</Button>;
}
