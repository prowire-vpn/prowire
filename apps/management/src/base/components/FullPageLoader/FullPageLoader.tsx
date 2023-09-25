import {Flex, Stack, Text, Spinner} from '@chakra-ui/react';
import * as React from 'react';

export function FullPageLoader() {
  return (
    <Flex height="100vh" align="center" justify="center">
      <Stack direction="row" spacing="4">
        <Spinner />
        <Text>Loading...</Text>
      </Stack>
    </Flex>
  );
}
