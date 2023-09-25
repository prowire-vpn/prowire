import {AccordionItem} from '@chakra-ui/react';
import * as React from 'react';
import {Fragment} from 'react';
import {UserActivityRowContent} from './UserActivityRowContent';
import {UserActivityRowTitle} from './UserActivityRowTitle';
import {UserClientSession} from 'user/data';

export interface UserActivityRowProps {
  session: UserClientSession;
}

export function UserActivityRow({session}: UserActivityRowProps) {
  return (
    <AccordionItem as={Fragment}>
      <UserActivityRowTitle session={session} />
      <UserActivityRowContent session={session} />
    </AccordionItem>
  );
}
