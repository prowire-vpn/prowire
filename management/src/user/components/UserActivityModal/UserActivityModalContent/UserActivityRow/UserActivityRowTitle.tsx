import {Badge, Tr, Td, Tooltip, AccordionButton, AccordionIcon} from '@chakra-ui/react';
import {VpnClientSessionDto} from '@prowire-vpn/api';
import {formatDistanceToNow, intlFormat, formatDistance} from 'date-fns';
import * as React from 'react';

export interface UserActivityRowProps {
  session: VpnClientSessionDto;
}

export function UserActivityRowTitle({session}: UserActivityRowProps) {
  const isConnected = !session.disconnectedAt;
  return (
    <AccordionButton as={Tr} style={{display: 'table-row'}}>
      <Td>
        <Badge colorScheme={isConnected ? 'green' : 'red'} fontSize="0.5em">
          {isConnected ? 'Connected' : 'Disconnected'}
        </Badge>
      </Td>
      <Td>
        <Tooltip
          label={intlFormat(new Date(session.createdAt), {
            weekday: 'short',
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          })}
        >
          {formatDistanceToNow(new Date(session.createdAt))}
        </Tooltip>
      </Td>
      <Td>
        {formatDistance(
          new Date(session.createdAt),
          session.disconnectedAt ? new Date(session.disconnectedAt) : new Date(),
        )}
      </Td>
      <Td>{session.assignedAddress ?? ''}</Td>
      <Td>
        <AccordionIcon />
      </Td>
    </AccordionButton>
  );
}
