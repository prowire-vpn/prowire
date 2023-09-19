import {Td, AccordionPanel, UnorderedList, ListItem} from '@chakra-ui/react';
import {VpnClientSessionDto} from '@prowire-vpn/api';
import * as React from 'react';

export interface UserActivityRowProps {
  session: VpnClientSessionDto;
}

export function UserActivityRowContent({session}: UserActivityRowProps) {
  return (
    <AccordionPanel
      motionProps={{style: {display: 'table-row'}}}
      as={Td}
      style={{display: 'table-cell'}}
      colSpan={5}
    >
      <UnorderedList>
        <ListItem>
          <b>Connected:</b> {session.connectedAt}
        </ListItem>
        <ListItem>
          <b>Disconnected:</b> {session.connectedAt}
        </ListItem>
        <ListItem>
          <b>Source IP:</b> {session.connectingAddress}
        </ListItem>
        <ListItem>
          <b>Assigned IP:</b> {session.assignedAddress}
        </ListItem>
        <ListItem>
          <b>User agent:</b> {session.device.ua}
        </ListItem>
      </UnorderedList>
    </AccordionPanel>
  );
}
