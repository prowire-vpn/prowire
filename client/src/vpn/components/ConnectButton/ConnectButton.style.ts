import {Pressable, Dimensions} from 'react-native';
import {styled} from 'styled-components/native';

export const Root = styled(Pressable)`
  border-radius: ${() =>
    Math.round(
      Dimensions.get('window').width + Dimensions.get('window').height,
    ) / 2}px;
  width: ${() => Dimensions.get('window').width * 0.5}px;
  height: ${() => Dimensions.get('window').width * 0.5}px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({theme}) => theme.colors.primary};
`;
