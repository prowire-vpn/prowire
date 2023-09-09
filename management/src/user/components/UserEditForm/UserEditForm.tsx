import * as React from 'react';
import {useCallback, ChangeEvent, FormEvent} from 'react';
import {useMutation} from 'react-query';
import {UserEditFormProps} from './UserEditForm.types';
import {postUser} from 'base/api';

/** Form to edit/create a user */
export function UserEditForm({user, setUser}: UserEditFormProps) {
  const postUserMutation = useMutation('postUser', postUser);

  // Name input change callback
  const editName = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (user) setUser({...user, name: event.target.value});
    },
    [user, setUser],
  );

  // Email input change callback
  const editEmail = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (user) setUser({...user, email: event.target.value});
    },
    [user, setUser],
  );

  // Submission callback
  const submit = useCallback(
    (event: FormEvent) => {
      console.log('Submit');
      if (!user) return;
      else if (!user.id) postUserMutation.mutate(user);
      else {
      }
      event.preventDefault();
    },
    [postUserMutation, user],
  );

  // Close the form
  const close = useCallback(() => {
    setUser(undefined);
  }, [setUser]);

  return user ? (
    <>
      <form onSubmit={submit}>
        <label htmlFor="name">Name</label>
        <input type="text" name="name" onChange={editName} value={user?.name} required />

        <label htmlFor="email">Email</label>
        <input type="text" name="email" onChange={editEmail} value={user?.email} required />

        <input type="submit" value="Save" />
      </form>
      <button onClick={close}>Close</button>
    </>
  ) : null;
}
