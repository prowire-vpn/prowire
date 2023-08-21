import {Grid, GridItem} from '@chakra-ui/react';
import * as React from 'react';
import {useState} from 'react';
import {UserListCard} from './UserListCard';
import {useFindUsers} from 'user/api';

export function UserListPage() {
  const [search, setSearch] = useState('');
  const {data, error, isLoading} = useFindUsers(search);
  if (error) return <p>error</p>;
  return (
    <Grid>
      <GridItem>
        <UserListCard data={data} isLoading={isLoading} search={search} setSearch={setSearch} />
      </GridItem>
    </Grid>
  );
}
