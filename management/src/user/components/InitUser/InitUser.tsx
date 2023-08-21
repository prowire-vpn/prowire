import {UserDto} from '@prowire-vpn/api';
import * as React from 'react';
import {useEffect, useState} from 'react';
import {useQuery} from 'react-query';
import {InitUserProps, IUserContext} from './InitUser.types';
import {getMe} from 'base/api';

export const UserContext = React.createContext<IUserContext>({
  me: undefined,
  setMe: () => {
    throw new Error('Not implemented');
  },
});

/** Makes sure that the user module is initialized before the app is accessed */
export function InitUser({children}: InitUserProps) {
  const [me, setMe] = useState<undefined | UserDto>(undefined);

  const {data} = useQuery('me', getMe);

  useEffect(() => {
    if (data?.user && data.user != me) {
      setMe(data.user);
    }
  }, [data, me]);

  return me ? (
    <UserContext.Provider value={{me, setMe}}>{children}</UserContext.Provider>
  ) : (
    <p>Loading user..</p>
  );
}
