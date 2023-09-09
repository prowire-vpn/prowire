import {UserDto} from '@prowire-vpn/api';
import * as React from 'react';
import {useCallback} from 'react';
import {useMutation} from 'react-query';
import {UserListTableProps} from './UserListTable.types';
import {deleteUser as deleteUserApi, queryClient} from 'base/api';

/** Table to display all users in the system */
export function UserListTable({users, setEditUser}: UserListTableProps) {
  // Open the edit form for a user
  const editUser = useCallback(
    (user: UserDto) => () => {
      setEditUser(user);
    },
    [setEditUser],
  );

  const {mutate} = useMutation('deleteUser', deleteUserApi, {
    onSuccess: async () => {
      await queryClient.invalidateQueries('listUsers');
    },
  });

  // Delete the use
  const deleteUser = useCallback(
    (user: UserDto) => () => {
      mutate(user.id);
    },
    [mutate],
  );

  const usersList = Object.values(users).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <table>
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Email</th>
          <th scope="col">Edit</th>
          <th scope="col">Delete</th>
        </tr>
      </thead>
      <tbody>
        {usersList.map((user) => (
          <tr key={user.id}>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>
              <button onClick={editUser(user)}>Edit</button>
            </td>
            <td>
              <button onClick={deleteUser(user)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
