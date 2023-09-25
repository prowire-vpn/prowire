import {styled} from 'styled-components/native';
import ProwireLogo from 'assets/logo_full.svg';
import {Typography} from 'ui/components';

export const Root = styled.View`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({theme}) => theme.spacing.l}px;
`;

export const Header = styled.View`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({theme}) => theme.spacing.l}px;
`;

export const Content = styled.View`
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
`;

export const Title = styled(Typography)`
  flex: 1;
`;

export const Logo = styled(ProwireLogo)`
  width: 33%;
  max-width: 33%;
`;
