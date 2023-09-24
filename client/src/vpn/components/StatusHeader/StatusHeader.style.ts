import {LinearGradient} from 'react-native-linear-gradient';
import {styled} from 'styled-components/native';
import {Typography} from 'ui/components';

export const Root = styled(LinearGradient)`
  display: flex;
  width: 100%;
  padding: ${({theme}) => theme.spacing.m}px;
`;

export const Status = styled(Typography)`
  text-align: center;
`;

export const Timer = styled(Typography)`
  text-align: center;
`;
