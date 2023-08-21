import {View, TextInput, Text} from 'react-native';
import {styled} from 'styled-components/native';

interface RootProps {
  focused: boolean;
}

export const Root = styled(View)<RootProps>`
  border-radius: ${({theme}) => theme.spacing.s}px;
  background-color: ${({theme}) => theme.colors.white};
  width: 100%;
  border-bottom-width: 2px;
  border-bottom-color: ${({theme, focused}) =>
    focused ? theme.colors.primary : 'transparent'};
`;

export const Input = styled(TextInput)`
  padding: ${({theme}) => theme.spacing.s}px;
  padding-top: 20px;
  width: 100%;
`;

interface LabelProps {
  focused: boolean;
}

export const Label = styled(Text)<LabelProps>`
  position: absolute;
  top: ${({theme}) => theme.spacing.xs}px;
  left: ${({theme}) => theme.spacing.s}px;
  color: ${({theme, focused}) =>
    focused ? theme.colors.primary : theme.colors.grey};
  font-size: 14px;
  font-weight: 500;
  line-height: 16px;
`;
