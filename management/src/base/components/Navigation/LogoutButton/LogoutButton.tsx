import {Button} from '@chakra-ui/react';
import * as React from 'react';
import {MdLogout} from 'react-icons/md';
import {useLogout} from 'auth/hooks';

export function LogoutButton() {
  const logout = useLogout();
  return (
    <Button leftIcon={<MdLogout />} variant="link" onClick={logout}>
      Log out
    </Button>
  );
}
