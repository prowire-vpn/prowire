import * as React from 'react';
import {useCallback, useState} from 'react';
import {PressableProps, GestureResponderEvent} from 'react-native';
import {SvgProps} from 'react-native-svg';
import {
  Root,
  ButtonVariants,
  ButtonColors,
  Label,
  LeftIconContainer,
} from './Button.style';

interface ButtonProps extends PressableProps {
  variant?: ButtonVariants;
  color?: ButtonColors;
  active?: boolean;
  text: string;
  disabled?: boolean;
  fullWidth?: boolean;
  prefixIcon?: React.FC<SvgProps>;
}

export function Button({
  text,
  variant = 'filled',
  color = 'primary',
  active = false,
  disabled = false,
  fullWidth = true,
  prefixIcon,
  ...props
}: ButtonProps) {
  const {style, onPressIn, onPressOut, ...rest} = props;
  const [pressed, setPressed] = useState<boolean>(false);
  const PrefixIcon = prefixIcon;

  const wrappedOnPressIn = useCallback(
    (event: GestureResponderEvent) => {
      setPressed(true);
      if (onPressIn) {
        onPressIn(event);
      }
    },
    [onPressIn],
  );

  const wrappedOnPressOut = useCallback(
    (event: GestureResponderEvent) => {
      setPressed(false);
      if (onPressOut) {
        onPressOut(event);
      }
    },
    [onPressOut],
  );

  return (
    <Root
      {...rest}
      onPressIn={wrappedOnPressIn}
      onPressOut={wrappedOnPressOut}
      fullWidth={fullWidth}
      style={style}
      variant={variant}
      color={color}
      pressed={pressed}
      disabled={disabled}
      active={active}>
      {PrefixIcon && (
        <LeftIconContainer>
          <PrefixIcon />
        </LeftIconContainer>
      )}
      <Label
        variant={variant}
        color={color}
        pressed={pressed}
        disabled={disabled}
        active={active}>
        {text}
      </Label>
    </Root>
  );
}
