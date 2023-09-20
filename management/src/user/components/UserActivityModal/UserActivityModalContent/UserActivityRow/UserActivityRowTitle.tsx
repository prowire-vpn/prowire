import {Badge, Tr, Td, Tooltip, AccordionButton, AccordionIcon} from '@chakra-ui/react';
import * as React from 'react';
import {UserClientSession} from 'user/data';

export interface UserActivityRowProps {
  session: UserClientSession;
}

export function UserActivityRowTitle({session}: UserActivityRowProps) {
  return (
    <AccordionButton as={Tr} style={{display: 'table-row'}}>
      <Td>
        <Badge colorScheme={session.isConnected ? 'green' : 'red'} fontSize="0.5em">
          {session.isConnected ? 'Connected' : 'Disconnected'}
        </Badge>
      </Td>
      <Td>
        <Tooltip label={session.createdAtFormatted}>{session.createdAtRelative}</Tooltip>
      </Td>
      <Td>
        <Tooltip label={session.durationFormatted}>{session.durationRelative}</Tooltip>
      </Td>
      <Td>{session.assignedAddress ?? ''}</Td>
      <Td>
        <AccordionIcon />
      </Td>
    </AccordionButton>
  );
}
