import {Tr, Td, Button, useDisclosure} from '@chakra-ui/react';
import {UserDto} from '@prowire-vpn/api';
import * as React from 'react';
import {useState} from 'react';
import {MdList} from 'react-icons/md';
import {UserActivityModal} from 'user/components';

export function UserList({users}: {users?: Array<UserDto>}) {
  const {isOpen, onOpen, onClose} = useDisclosure();
  const [user, setUser] = useState<UserDto | undefined>(undefined);
  return (
    <>
      <UserActivityModal isOpen={isOpen} onClose={onClose} user={user} />

      {users?.map((user) => (
        <Tr key={user.id}>
          {/* <Td>
            <Avatar src={user.avatar}></Avatar>
          </Td> */}
          <Td>{user.name}</Td>
          <Td>{user.email}</Td>
          <Td>
            <Button
              leftIcon={<MdList />}
              onClick={() => {
                setUser(user);
                onOpen();
              }}
            >
              Activity
            </Button>
          </Td>
        </Tr>
      ))}
    </>
  );
}
