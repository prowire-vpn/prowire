import * as React from 'react';
import {PropsWithChildren} from 'react';
import {QueryClientProvider} from 'react-query';
import {ThemeProvider} from 'styled-components/native';
import {AuthProvider} from 'auth/state';
import {queryClient} from 'base/api/client';
import {ConfigProvider} from 'config/state';
import {theme} from 'ui/theme';

export function Providers({children}: PropsWithChildren) {
  return (
    <ConfigProvider>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </ThemeProvider>
      </AuthProvider>
    </ConfigProvider>
  );
}