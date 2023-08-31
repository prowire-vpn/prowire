import * as React from 'react';
import {PropsWithChildren} from 'react';
import {QueryClientProvider} from 'react-query';
import {ThemeProvider} from 'styled-components/native';
import {AuthProvider} from 'auth/state';
import {queryClient} from 'base/data';
import {ConfigProvider} from 'config/state';
import {theme} from 'ui/theme';
import {VpnProvider} from 'vpn/state';

export function Providers({children}: PropsWithChildren) {
  return (
    <ConfigProvider>
      <AuthProvider>
        <VpnProvider>
          <ThemeProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
              {children}
            </QueryClientProvider>
          </ThemeProvider>
        </VpnProvider>
      </AuthProvider>
    </ConfigProvider>
  );
}
