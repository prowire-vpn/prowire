import {UserDto} from '@prowire-vpn/api';
import {ReactNode} from 'react';

/** Props of the InitUser component */
export interface InitUserProps {
  /** children of the init component */
  children: ReactNode;
}

export interface IUserContext {
  me?: UserDto;
  setMe: (me: UserDto) => void;
}
