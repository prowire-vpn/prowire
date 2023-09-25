import {PropsWithChildren} from 'react';
import * as React from 'react';
import {setBaseUrl} from 'base/data';
import {useGetApiUrl, useGetHealth} from 'config/data';
import {ApiConfigPage, ServerUnreachablePage} from 'config/pages';
import {useConfig, useConfigDispatch} from 'config/state';

export function ConfigInit({children}: PropsWithChildren) {
  const {apiUrl, apiHealthy} = useConfig();
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

  const {isError} = useGetHealth(apiUrl, {
    enabled: !!apiUrl,
    suspense: apiHealthy === undefined,
    refetchInterval: 10_000,
    retry: false,
    onSettled: (data, error) => {
      const healthy = !error && !!data?.healthy;
      dispatch({type: 'apiHealth', payload: healthy});
    },
  });

  if (isError) {
    return <ServerUnreachablePage />;
  }

  if (apiUrl) {
    return <>{children}</>;
  }

  return <ApiConfigPage />;
}
