import {View, SafeAreaView} from 'react-native';
import {styled} from 'styled-components/native';

export const Root = styled(View)`
  flex: 1;
  background-color: ${({theme}) => theme.colors.background};
  display: flex;
`;

export const ContentArea = styled(SafeAreaView)`
  flex: 1;
  display: flex;
`;
