import {View, ActivityIndicator} from 'react-native';
import {styled} from 'styled-components/native';

export const Root = styled(View)`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Loader = styled(ActivityIndicator)`
  width: 100%;
  height: 100%;
`;
