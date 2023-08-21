import {UserDto} from '@prowire-vpn/api';

export interface UserListTableProps {
  users: Array<UserDto>;
  setEditUser: (user: UserDto) => void;
}
