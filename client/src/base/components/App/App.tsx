import {NavigationContainer} from '@react-navigation/native';
import * as React from 'react';
import {StatusBar, useColorScheme, Text} from 'react-native';
import {Root, ContentArea} from './App.style';
import {LogoutButton} from 'auth/components';
import {Init} from 'base/components/Init';
import {Providers} from 'base/components/Providers';

export function App() {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <NavigationContainer documentTitle={{enabled: false}}>
      <Providers>
        <Root>
          <ContentArea>
            <StatusBar
              barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            />
            <Init>
              <Text>Home</Text>
              <LogoutButton />
            </Init>
          </ContentArea>
        </Root>
      </Providers>
    </NavigationContainer>
  );
}
