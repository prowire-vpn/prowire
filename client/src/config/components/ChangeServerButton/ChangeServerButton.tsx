import * as React from 'react';
import {useCallback} from 'react';
import {Button} from './ChangeServerButton.style';
import {useClearApiUrl} from 'config/data';
import {useConfigDispatch} from 'config/state';

export function ChangeServerButton() {
  const dispatch = useConfigDispatch();
  const {mutate: clear} = useClearApiUrl();

  const onPress = useCallback(() => {
    clear(undefined);
    dispatch({type: 'clear'});
  }, [clear, dispatch]);

  return (
    <Button color="secondary" onPress={onPress}>
      Change Prowire server
    </Button>
  );
}
