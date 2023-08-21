import Color from 'color';
import {Pressable, View} from 'react-native';
import {DefaultTheme, styled} from 'styled-components/native';
import {Typography} from 'ui/components/Typography';

export type ButtonVariants = 'filled' | 'outlined';

export type ButtonColors = 'primary' | 'white' | 'danger';

interface ColorFetcherProps {
  theme: DefaultTheme;
  color: ButtonColors;
  pressed: boolean;
  active: boolean;
  disabled: boolean;
}

interface ColorFetcherReturn {
  color: string;
  backgroundColor: string;
  borderColor: string;
}

type ColorFetcher = (props: ColorFetcherProps) => ColorFetcherReturn;

function getFilledColors({
  theme,
  color,
  pressed,
  active,
  disabled,
}: ColorFetcherProps): ColorFetcherReturn {
  const base = {
    backgroundColor: theme.buttonColors[color].base,
    color: theme.buttonColors[color].textContrast,
    borderColor: 'transparent',
  };

  if (pressed) {
    return {
      ...base,
      backgroundColor: Color(base.backgroundColor).darken(0.2).hex(),
    };
  }

  if (active) {
    return {
      ...base,
      backgroundColor: theme.buttonColors[color].active,
    };
  }

  if (disabled) {
    return {
      ...base,
      backgroundColor: theme.colors.lightGrey,
      color: theme.colors.grey,
    };
  }

  return base;
}

function getOutlinedColors({
  theme,
  color,
  pressed,
  active,
  disabled,
}: ColorFetcherProps): ColorFetcherReturn {
  const base = {
    backgroundColor: 'transparent',
    color: theme.buttonColors[color].base,
    borderColor: theme.buttonColors[color].base,
  };

  if (pressed) {
    return {
      ...base,
      backgroundColor: Color(base.backgroundColor).darken(0.2).hex(),
      color: theme.buttonColors[color].textContrast,
    };
  }

  if (active) {
    return {
      ...base,
      backgroundColor: theme.buttonColors[color].base,
      color: theme.buttonColors[color].textContrast,
    };
  }

  if (disabled) {
    return {
      ...base,
      color: theme.colors.lightGrey,
      borderColor: theme.colors.lightGrey,
    };
  }

  return base;
}

const variantColorFetcher: {[key in ButtonVariants]: ColorFetcher} = {
  filled: getFilledColors,
  outlined: getOutlinedColors,
};

interface BaseProps {
  variant: ButtonVariants;
  color: ButtonColors;
  pressed: boolean;
  active: boolean;
  disabled: boolean;
}

type RootProps = BaseProps & {
  fullWidth: boolean;
};

type LabelProps = BaseProps;

export const Root = styled(Pressable)<RootProps>`
  width: ${({fullWidth}) => (fullWidth ? '100%' : 'auto')};
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding-horizontal: ${({theme}) => theme.spacing.l}px;
  padding-vertical: ${({theme}) => theme.spacing.m}px;
  border-radius: ${({theme}) => theme.spacing.s}px;
  border-width: ${({variant}) => (variant === 'outlined' ? 1 : 0)}px;
  background-color: ${({variant, ...props}) =>
    variantColorFetcher[variant](props).backgroundColor};
`;

export const Label = styled(Typography)<LabelProps>`
  text-align: center;
  color: ${({variant, ...props}) => variantColorFetcher[variant](props).color};
`;

export const LeftIconContainer = styled(View)`
  margin-right: ${({theme}) => theme.spacing.s}px;
`;
