import {TableContainer, Table, Thead, Tr, Th, Td, Tbody, Text, Accordion} from '@chakra-ui/react';
import {UserDto} from '@prowire-vpn/api';
import * as React from 'react';
import {UserActivityRow} from './UserActivityRow';
import {useListUserClientSessions} from 'user/data';

export interface UserActivityModalContentProps {
  user: UserDto;
}

export function UserActivityModalContent({user}: UserActivityModalContentProps) {
  const {data} = useListUserClientSessions(user.id, {suspense: true});
  return (
    <TableContainer>
      <Table>
        <Thead>
          <Tr>
            <Th>Status</Th>
            <Th>Connected</Th>
            <Th>Duration</Th>
            <Th>Assigned IP</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Accordion as={Tbody} allowMultiple allowToggle>
          {data && data.sessions.length > 0 ? (
            data.sessions.map((session) => <UserActivityRow session={session} key={session.id} />)
          ) : (
            <Tr>
              <Td colSpan={3}>
                <Text align="center">The user has no activity</Text>
              </Td>
            </Tr>
          )}
        </Accordion>
      </Table>
    </TableContainer>
  );
}
