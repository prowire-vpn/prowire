import {ChakraProvider} from '@chakra-ui/react';
import * as React from 'react';
import {QueryClientProvider} from 'react-query';
import {ProviderProps} from './Provider.types';
import {queryClient} from 'base/api';
import {theme} from 'base/theme';

/** All global providers of the application are declared here */
export function Provider({children}: ProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>{children}</ChakraProvider>
    </QueryClientProvider>
  );
}
