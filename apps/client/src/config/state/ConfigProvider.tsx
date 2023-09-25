import {
  useReducer,
  PropsWithChildren,
  createContext,
  useContext,
  Dispatch,
} from 'react';
import * as React from 'react';
import {ConfigActions} from './action';
import {ConfigState, initialConfig, configReducer} from './reducer';

const ConfigContext = createContext<null | ConfigState>(null);
const ConfigDispatchContext = createContext<null | Dispatch<ConfigActions>>(
  null,
);

export function ConfigProvider({children}: PropsWithChildren) {
  const [config, dispatch] = useReducer(configReducer, initialConfig);
  return (
    <ConfigContext.Provider value={config}>
      <ConfigDispatchContext.Provider value={dispatch}>
        {children}
      </ConfigDispatchContext.Provider>
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
}

export function useConfigDispatch() {
  const context = useContext(ConfigDispatchContext);
  if (!context) {
    throw new Error('useConfigDispatch must be used within a ConfigProvider');
  }
  return context;
}
