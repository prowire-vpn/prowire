import * as React from 'react';
import {useCallback} from 'react';
import {useForm, Controller} from 'react-hook-form';
import validator from 'validator';
import {useConfig, useConfigDispatch} from 'config/state';
import {Button, TextInput, Typography} from 'ui/components';

type FormData = {
  url: string;
};

export function ApiUrlInputForm() {
  const {error} = useConfig();
  const dispatch = useConfigDispatch();

  const {
    control,
    handleSubmit,
    formState: {isValid},
  } = useForm<FormData>({defaultValues: {url: ''}});

  const onSubmit = useCallback(
    ({url}: FormData) => {
      dispatch({type: 'input', payload: url});
    },
    [dispatch],
  );

  return (
    <>
      <Controller
        control={control}
        rules={{required: true, validate: data => validator.isURL(data)}}
        name="url"
        render={({field: {onBlur, onChange, value}}) => (
          <TextInput
            label="Server URL"
            value={value}
            onChange={onChange}
            onBlur={onBlur}
          />
        )}
      />

      {error ? (
        <Typography color="error" align="center">
          Failed to connect to server. Please verify the address.
        </Typography>
      ) : null}

      <Button
        color="white"
        text="Connect"
        onPress={handleSubmit(onSubmit)}
        disabled={!isValid}
      />
    </>
  );
}
