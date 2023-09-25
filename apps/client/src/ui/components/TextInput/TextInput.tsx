import * as React from 'react';
import {useCallback, useState} from 'react';
import {
  TextInputProps as NativeTextInputProps,
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from 'react-native';
import {Root, Input, Label} from './TextInput.style';

type TextInputProps = NativeTextInputProps & {label?: string};

export function TextInput({
  label,
  onFocus: nativeOnFocus,
  onBlur: nativeOnBlur,
  ...props
}: TextInputProps) {
  const [focused, setFocused] = useState<boolean>(false);
  const onFocus = useCallback(
    (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setFocused(true);
      if (nativeOnFocus) {
        nativeOnFocus(event);
      }
    },
    [nativeOnFocus],
  );

  const onBlur = useCallback(
    (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setFocused(false);
      if (nativeOnBlur) {
        nativeOnBlur(event);
      }
    },
    [nativeOnBlur],
  );
  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <Root isFocused={focused}>
      {label && (
        <Label
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          isFocused={focused}>
          {label}
        </Label>
      )}
      <Input onFocus={onFocus} onBlur={onBlur} {...props} />
    </Root>
  );
}
