import {Pressable, Dimensions} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {styled} from 'styled-components/native';

export const Root = styled(LinearGradient)`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({theme}) =>
    Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2 +
    theme.spacing.l}px;
  width: ${({theme}) => Math.round(Dimensions.get('window').width / 2) + theme.spacing.l}px;
  height: ${({theme}) => Math.round(Dimensions.get('window').width / 2) + theme.spacing.l}px;
`;

export const Button = styled(Pressable)`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({theme}) => theme.colors.primary};
  border-radius: ${() =>
    Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2}px;
  width: ${() => Math.round(Dimensions.get('window').width / 2)}px;
  height: ${() => Math.round(Dimensions.get('window').width / 2)}px;
`;
