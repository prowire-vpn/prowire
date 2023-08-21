import {ReactNode} from 'react';

/** Props of the InitAuth component */
export interface InitAuthProps {
  /** children of the init component */
  children: ReactNode;
}

export interface IAuthContext {
  accessToken: undefined | string;
  setAccessToken: (token: string) => void;
}
