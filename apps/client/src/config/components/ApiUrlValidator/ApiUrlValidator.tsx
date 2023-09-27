import * as React from 'react';
import {PropsWithChildren} from 'react';
import {setBaseUrl} from 'base/data';
import {useGetHealth, useStoreApiUrl} from 'config/data';
import {useConfig, useConfigDispatch} from 'config/state';

export function ApiUrlValidator({children}: PropsWithChildren) {
  const {inputApiUrl} = useConfig();
  const dispatch = useConfigDispatch();

  const {mutate: store} = useStoreApiUrl();

  useGetHealth(inputApiUrl, {
    enabled: !!inputApiUrl,
    retry: 0,
    suspense: true,
    onSuccess: () => {
      if (!inputApiUrl) {
        throw new Error('inputApiUrl is undefined');
      }
      store(inputApiUrl);
      setBaseUrl(inputApiUrl);
      dispatch({type: 'validate', payload: inputApiUrl});
    },
    onError: (err) => {
      dispatch({type: 'error', payload: err});
    },
  });

  return <>{children}</>;
}
