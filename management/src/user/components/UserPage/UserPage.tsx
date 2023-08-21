import {UserDto} from '@prowire-vpn/api';
import * as React from 'react';
import {useCallback, useEffect, useState} from 'react';
import {useQuery} from 'react-query';
import {getAllUsers} from 'base/api';
import {UserEditForm} from 'user/components/UserEditForm';
import {UserListTable} from 'user/components/UserListTable';

/** User management page */
export function UserPage() {
  const [users, setUsers] = useState<Array<UserDto>>([]);
  const [editUser, setEditUser] = useState<(Omit<UserDto, 'id'> & {_id?: string}) | undefined>(
    undefined,
  );

  const {data} = useQuery('listUsers', getAllUsers);

  useEffect(() => {
    if (data?.users && data.users !== users) setUsers(data.users);
  }, [users, setUsers, data]);

  const newUser = useCallback(() => {
    setEditUser({name: '', email: '', admin: false});
  }, []);

  return (
    <>
      <button onClick={newUser}>New user</button>
      <UserListTable users={users} setEditUser={setEditUser} />
      <UserEditForm user={editUser} setUser={setEditUser} />
    </>
  );
}
