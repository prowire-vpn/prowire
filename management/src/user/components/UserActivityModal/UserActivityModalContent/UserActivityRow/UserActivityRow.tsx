import {AccordionItem} from '@chakra-ui/react';
import {VpnClientSessionDto} from '@prowire-vpn/api';
import * as React from 'react';
import {Fragment} from 'react';
import {UserActivityRowContent} from './UserActivityRowContent';
import {UserActivityRowTitle} from './UserActivityRowTitle';

export interface UserActivityRowProps {
  session: VpnClientSessionDto;
}

export function UserActivityRow({session}: UserActivityRowProps) {
  return (
    <AccordionItem as={Fragment}>
      <UserActivityRowTitle session={session} />
      <UserActivityRowContent session={session} />
    </AccordionItem>
  );
}
