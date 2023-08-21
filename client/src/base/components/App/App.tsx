import {NavigationContainer} from '@react-navigation/native';
import * as React from 'react';
import {SafeAreaView, StatusBar, useColorScheme} from 'react-native';
import {QueryClientProvider} from 'react-query';
import {ThemeProvider} from 'styled-components/native';
import {queryClient} from 'base/api/client';
import {ApiConfigPage} from 'config/pages';
import {ConfigProvider} from 'config/state';
import {theme} from 'ui/theme';

export function App() {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <NavigationContainer>
      <ConfigProvider>
        <ThemeProvider theme={theme}>
          <QueryClientProvider client={queryClient}>
            <SafeAreaView>
              <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
              />
              <ApiConfigPage />
            </SafeAreaView>
          </QueryClientProvider>
        </ThemeProvider>
      </ConfigProvider>
    </NavigationContainer>
  );
}
