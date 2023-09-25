import {Card, CardBody, CardHeader, Heading, Flex, Box} from '@chakra-ui/react';
import {FindUsersResponseBodyDto} from '@prowire-vpn/api';
import * as React from 'react';
import {InviteUserButton} from './InviteUserButton';
import {SearchUserInput} from './SearchUserInput';
import {UserListTable} from './UserListTable';

export function UserListCard({
  data,
  search,
  setSearch,
  isLoading,
}: {
  data?: FindUsersResponseBodyDto;
  search: string;
  setSearch: (search: string) => void;
  isLoading: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <Flex direction="row" justify="space-between">
          <Heading>Users</Heading>
          <InviteUserButton />
        </Flex>
        <Box marginTop={4}>
          <SearchUserInput search={search} setSearch={setSearch} />
        </Box>
      </CardHeader>
      <CardBody>
        <UserListTable isLoading={isLoading} users={data?.users} />
      </CardBody>
    </Card>
  );
}
