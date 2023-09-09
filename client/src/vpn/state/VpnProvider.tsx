import {
  useReducer,
  PropsWithChildren,
  createContext,
  useContext,
  Dispatch,
} from 'react';
import * as React from 'react';
import {VpnActions} from './action';
import {VpnState, initialState, vpnReducer} from './reducer';

const VpnContext = createContext<null | VpnState>(null);
const VpnDispatchContext = createContext<null | Dispatch<VpnActions>>(null);

export function VpnProvider({children}: PropsWithChildren) {
  const [config, dispatch] = useReducer(vpnReducer, initialState);
  return (
    <VpnContext.Provider value={config}>
      <VpnDispatchContext.Provider value={dispatch}>
        {children}
      </VpnDispatchContext.Provider>
    </VpnContext.Provider>
  );
}

export function useVpn() {
  const context = useContext(VpnContext);
  if (!context) {
    throw new Error('useVpn must be used within a VpnProvider');
  }
  return context;
}

export function useVpnDispatch() {
  const context = useContext(VpnDispatchContext);
  if (!context) {
    throw new Error('useVpnDispatch must be used within a VpnProvider');
  }
  return context;
}
