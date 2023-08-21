import {Button} from '@chakra-ui/react';
import * as React from 'react';
import {MdLogout} from 'react-icons/md';

export function LogoutButton() {
  return (
    <Button leftIcon={<MdLogout />} variant="link">
      Log out
    </Button>
  );
}
