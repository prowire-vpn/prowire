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
  const [tasks, dispatch] = useReducer(configReducer, initialConfig);
  return (
    <ConfigContext.Provider value={tasks}>
      <ConfigDispatchContext.Provider value={dispatch}>
        {children}
      </ConfigDispatchContext.Provider>
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  return useContext(ConfigContext);
}

export function useConfigDispatch() {
  return useContext(ConfigDispatchContext);
}
