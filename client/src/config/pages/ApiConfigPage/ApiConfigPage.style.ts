import {View} from 'react-native';
import {styled} from 'styled-components/native';
import Logo from 'assets/logo_full.svg';
import {Typography} from 'ui/components';

export const Root = styled(View)`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({theme}) => theme.spacing.l}px;
  background-color: ${({theme}) => theme.colors.background};
  gap: ${({theme}) => theme.spacing.l}px;
`;

export const ProwireLogo = styled(Logo)`
  width: 75%;
  max-width: 75%;
`;

export const SelectConnectionText = styled(Typography)`
  text-align: center;
`;
