import * as React from 'react';
import {PropsWithChildren} from 'react';
import {AuthInit} from 'auth/components';
import {FullPageLoader} from 'base/components';
import {useGetClientConfig} from 'base/data';
import {useConfig, useConfigDispatch} from 'base/state';

/** Component that runs all checks before showing the main app */
export function ConfigInit({children}: PropsWithChildren) {
  const {apiUrl} = useConfig();
  const dispatch = useConfigDispatch();

  // We first ensure that we have loaded the client config located in its ini file
  useGetClientConfig({
    enabled: !apiUrl,
    suspense: true,
    onSuccess: (data) => {
      dispatch({type: 'set', payload: data});
    },
    onError: (err) => {
      dispatch({type: 'error', payload: err});
    },
  });

  if (!apiUrl) return <FullPageLoader />;
  return <AuthInit>{children}</AuthInit>;
}
