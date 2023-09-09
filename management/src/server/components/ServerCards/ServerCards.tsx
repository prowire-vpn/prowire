import {SimpleGrid} from '@chakra-ui/react';
import {ServerDto} from '@prowire-vpn/api';
import * as React from 'react';
import {ServerCard} from './ServerCard';

export function ServerCards({servers}: {servers?: Array<ServerDto>}) {
  return (
    <SimpleGrid columns={4} spacing={4}>
      {servers?.map((server) => (
        <ServerCard key={server.name} server={server} />
      ))}
    </SimpleGrid>
  );
}
