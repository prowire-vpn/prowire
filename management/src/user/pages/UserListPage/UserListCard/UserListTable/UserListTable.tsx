import {TableContainer, Table, Thead, Tbody, Tr, Th, Text, Td} from '@chakra-ui/react';
import {FindUsersResponseBodyDto} from '@prowire-vpn/api';
import * as React from 'react';
import {SkeletonUserList} from './SkeletonUserList';
import {UserList} from './UserList';

export function UserListTable({
  users,
  isLoading,
}: {
  users?: FindUsersResponseBodyDto['users'];
  isLoading: boolean;
}) {
  return (
    <TableContainer>
      <Table>
        <Thead>
          <Tr>
            <Th>Avatar</Th>
            <Th>Name</Th>
          </Tr>
        </Thead>
        <Tbody>
          {isLoading ? (
            <SkeletonUserList />
          ) : users?.length ?? 0 > 0 ? (
            <UserList users={users} />
          ) : (
            <Tr>
              <Td colSpan={2}>
                <Text align="center">No result found</Text>
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
