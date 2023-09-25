import {
  useReducer,
  PropsWithChildren,
  createContext,
  useContext,
  Dispatch,
} from 'react';
import * as React from 'react';
import {AuthActions} from './action';
import {AuthState, initialAuth, authReducer} from './reducer';

const AuthContext = createContext<null | AuthState>(null);
const AuthDispatchContext = createContext<null | Dispatch<AuthActions>>(null);

export function AuthProvider({children}: PropsWithChildren) {
  const [config, dispatch] = useReducer(authReducer, initialAuth);
  return (
    <AuthContext.Provider value={config}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
}

export function useAuthDispatch() {
  const context = useContext(AuthDispatchContext);
  if (!context) {
    throw new Error('useAuthDispatch must be used within a AuthProvider');
  }
  return context;
}
