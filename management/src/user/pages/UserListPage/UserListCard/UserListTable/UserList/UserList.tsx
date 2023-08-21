import {Tr, Td, Avatar} from '@chakra-ui/react';
import {FindUsersResponseBodyDto} from '@prowire-vpn/api';
import * as React from 'react';

export function UserList({users}: {users?: FindUsersResponseBodyDto['users']}) {
  return (
    <>
      {users?.map((user) => (
        <Tr key={user.id}>
          <Td>
            <Avatar src={user.avatar}></Avatar>
          </Td>
          <Td>{user.name}</Td>
        </Tr>
      ))}
    </>
  );
}
