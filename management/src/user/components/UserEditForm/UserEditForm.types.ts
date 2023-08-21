import {UserDto} from '@prowire-vpn/api';

/** Props of the UserEditForm component */
export interface UserEditFormProps {
  /** User to edit, if undefined will display a form to create a new user */
  user?: Omit<UserDto, 'id'> & {id?: string};
  /** Used to update the edited user */
  setUser: (user?: Omit<UserDto, 'id'> & {id?: string}) => void;
}
