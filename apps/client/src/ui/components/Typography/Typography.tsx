import * as React from 'react';
import {PropsWithChildren} from 'react';
import {Text, TextProps, TextStyle} from 'react-native';
import {useTheme} from 'styled-components/native';
import {Theme} from 'ui/theme';

interface TypographyProps extends TextProps {
  variant?: keyof Theme['textVariants'];
  color?: keyof Theme['textColors'];
  align?: TextStyle['textAlign'];
}

export function Typography({
  children,
  variant = 'body',
  color = 'primary',
  align,
  ...props
}: PropsWithChildren<TypographyProps>) {
  const theme = useTheme();
  const {style, ...rest} = props;
  const baseStyle: TextStyle = {
    ...theme.textVariants[variant],
    color: theme.textColors[color],
    textAlign: align,
  };
  return (
    <Text {...rest} style={[baseStyle, style]}>
      {children}
    </Text>
  );
}
