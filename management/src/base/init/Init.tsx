import * as React from 'react';
import {useEffect, useState} from 'react';
import {InitProps} from './Init.types';
import {InitAuth} from 'auth/init';
import {useGetClientConfig} from 'base/api';
import {GetClientConfigResponseBody} from 'base/api/requests/getClientConfig';
import {FullPageLoader} from 'base/components';
import {ConfigContext} from 'base/context';

/** Component that runs all checks before showing the main app */
export function Init({children}: InitProps) {
  const [clientConfig, setClientConfig] = useState<undefined | GetClientConfigResponseBody>(
    undefined,
  );

  // We first ensure that we have loaded the client config located in its ini file
  const {data: clientConfigFetched} = useGetClientConfig({
    enabled: !clientConfig,
  });

  useEffect(() => {
    if (!clientConfig && clientConfigFetched) {
      setClientConfig(clientConfigFetched);
    }
  }, [clientConfig, clientConfigFetched, setClientConfig]);

  if (!clientConfig) return <FullPageLoader />;
  return (
    <ConfigContext.Provider value={{clientConfig, setClientConfig}}>
      <InitAuth>{children}</InitAuth>
    </ConfigContext.Provider>
  );
}
