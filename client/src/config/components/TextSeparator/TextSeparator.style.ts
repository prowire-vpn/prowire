import {View} from 'react-native';
import {styled} from 'styled-components/native';
import {Typography} from 'ui/components';

export const Root = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const Separator = styled(View)`
  flex: 1;
  height: 1px;
  background-color: ${({theme}) => theme.colors.lightGrey};
`;

export const Text = styled(Typography)`
  margin: 0 ${({theme}) => theme.spacing.m}px;
`;
