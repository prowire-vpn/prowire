import {NavigationContainer} from '@react-navigation/native';
import * as React from 'react';
import {StatusBar, useColorScheme} from 'react-native';
import {Root, ContentArea} from './App.style';
import {Init} from 'base/components/Init';
import {Providers} from 'base/components/Providers';
import {HomePage} from 'vpn/pages';

export function App() {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <NavigationContainer documentTitle={{enabled: false}}>
      <Providers>
        <Root>
          <ContentArea>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            <Init>
              <HomePage />
            </Init>
          </ContentArea>
        </Root>
      </Providers>
    </NavigationContainer>
  );
}
