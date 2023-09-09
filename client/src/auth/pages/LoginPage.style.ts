import {View} from 'react-native';
import {styled} from 'styled-components/native';
import LogoIcon from 'assets/logo_full.svg';

export const Root = styled(View)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({theme}) => theme.spacing.l}px;
  gap: ${({theme}) => theme.spacing.l}px;
`;

export const Logo = styled(LogoIcon)`
  width: 33%;
  max-width: 33%;
  height: auto;
`;
