import {Td, AccordionPanel, SimpleGrid, Box, Text, Heading} from '@chakra-ui/react';
import * as React from 'react';
import {UserClientSession} from 'user/data';

export interface UserActivityRowProps {
  session: UserClientSession;
}

export function UserActivityRowContent({session}: UserActivityRowProps) {
  return (
    <AccordionPanel
      motionProps={{style: {display: 'table-row'}}}
      as={Td}
      style={{display: 'table-cell'}}
      colSpan={5}
    >
      <SimpleGrid columns={2} spacing={4}>
        <Box>
          <Heading size="sm">Started</Heading>
          <Text>{session.createdAtFormatted}</Text>
        </Box>
        <Box>
          <Heading size="sm">Disconnected</Heading>
          <Text>{session.disconnectedAtFormatted}</Text>
        </Box>
        <Box>
          <Heading size="sm">Source IP</Heading>
          <Text>{session.connectingAddress}</Text>
        </Box>
        <Box>
          <Heading size="sm">Assigned IP</Heading>
          <Text>{session.assignedAddress}</Text>
        </Box>
        <Box>
          <Heading size="sm">VPN server</Heading>
          <Text>{session.serverId ?? ''}</Text>
        </Box>
        <Box>
          <Heading size="sm">Data transferred (in / out)</Heading>
          <Text>
            {session.bytesInFormatted} / {session.bytesOutFormatted}
          </Text>
        </Box>
      </SimpleGrid>
    </AccordionPanel>
  );
}
