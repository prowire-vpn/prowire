import {PropsWithChildren} from 'react';
import * as React from 'react';
import {setBaseUrl} from 'base/data';
import {useGetApiUrl} from 'config/data';
import {ApiConfigPage} from 'config/pages';
import {useConfig, useConfigDispatch} from 'config/state';

export function ConfigInit({children}: PropsWithChildren) {
  const config = useConfig();
  const dispatch = useConfigDispatch();

  useGetApiUrl({
    suspense: true,
    onSuccess: url => {
      if (url) {
        setBaseUrl(url);
        dispatch({type: 'validate', payload: url});
      }
    },
  });

  if (config.apiUrl) {
    return <>{children}</>;
  }

  return <ApiConfigPage />;
}
