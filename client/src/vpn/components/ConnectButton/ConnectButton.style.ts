import {Pressable} from 'react-native';
import {styled} from 'styled-components/native';

export const Root = styled(Pressable)`
  height: 0;
  width: 50%;
  padding-bottom: 50%;
  background-color: ${({theme}) => theme.colors.primary};
`;

export const Content = styled.View`
  position: absolute;
  height: 100%;
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
