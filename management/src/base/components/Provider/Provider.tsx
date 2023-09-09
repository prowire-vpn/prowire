import {ChakraProvider} from '@chakra-ui/react';
import * as React from 'react';
import {QueryClientProvider} from 'react-query';
import {ProviderProps} from './Provider.types';
import {AuthProvider} from 'auth/state';
import {queryClient} from 'base/data';
import {ConfigProvider} from 'base/state';
import {theme} from 'base/theme';

/** All global providers of the application are declared here */
export function Provider({children}: ProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <ConfigProvider>
          <AuthProvider>{children}</AuthProvider>
        </ConfigProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
}
