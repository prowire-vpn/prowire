import {Card, CardHeader, CardBody, Tag, UnorderedList, ListItem} from '@chakra-ui/react';
import {ServerDto} from '@prowire-vpn/api';
import * as React from 'react';

export function ServerCard({server}: {server: ServerDto}) {
  return (
    <Card>
      <CardHeader>
        <Tag
          colorScheme={server.connected ? (server.active ? 'green' : 'orange') : 'red'}
          marginRight={2}
        >
          {server.connected ? (server.active ? 'Active' : 'Available') : 'Offline'}
        </Tag>
        {server.name}
      </CardHeader>
      <CardBody>
        <UnorderedList>
          <ListItem>IP: {server.ip}</ListItem>
          <ListItem>Port: {server.port}</ListItem>
        </UnorderedList>
      </CardBody>
    </Card>
  );
}
