import {Button} from '@chakra-ui/react';
import * as React from 'react';
import {MdPersonAdd} from 'react-icons/md';

export function InviteUserButton() {
  return <Button leftIcon={<MdPersonAdd />}>Invite</Button>;
}
