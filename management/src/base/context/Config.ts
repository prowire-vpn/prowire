import * as React from 'react';
import {GetClientConfigResponseBody} from 'base/api/requests';

export interface IConfigContext {
  clientConfig: undefined | GetClientConfigResponseBody;
  setClientConfig: (config: GetClientConfigResponseBody) => void;
}

export const defaultConfigContext = {
  clientConfig: undefined,
  setClientConfig: () => {
    throw new Error('Not implemented');
  },
};

export const ConfigContext = React.createContext<IConfigContext>(defaultConfigContext);
