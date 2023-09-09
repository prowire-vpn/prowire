import {View} from 'react-native';
import {styled} from 'styled-components/native';

export const Root = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${({theme}) => theme.spacing.l}px;
  gap: ${({theme}) => theme.spacing.l}px;
`;
