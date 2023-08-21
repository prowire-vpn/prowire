import * as React from 'react';
import {useState, useCallback, useEffect} from 'react';
import validator from 'validator';
import {Root, ProwireLogo, SelectConnectionText} from './ApiConfigPage.style';
import ScanIcon from 'assets/icons/scan.svg';
import {setBaseUrl} from 'base/api/client';
import {useGetHealth} from 'config/api';
import {TextSeparator} from 'config/components';
import {Button, TextInput, Typography} from 'ui/components';

export function ApiConfigPage() {
  const [url, setUrl] = useState<string>('');
  const [disabled, setDisabled] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown | undefined>(undefined);

  const onChangeText = useCallback((text: string) => {
    setUrl(text);
    setDisabled(!validator.isURL(text));
  }, []);

  const onPressConnect = useCallback(() => {
    setBaseUrl(url);
    setLoading(true);
    setError(undefined);
  }, [url]);

  const {
    isSuccess,
    isError,
    error: queryError,
    data,
  } = useGetHealth({
    enabled: loading,
    retry: 0,
  });

  useEffect(() => {
    if (isSuccess) {
      console.log('Success', data);
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (isError) {
      setLoading(false);
      setError(queryError);
    }
  }, [isError, queryError]);

  return (
    <Root>
      <ProwireLogo />
      <SelectConnectionText variant="header" color="primary">
        Connect to server by QR or manually type address
      </SelectConnectionText>
      <Button
        color="white"
        text="Scan connection QR"
        onPress={() => console.log('Press')}
        // prefixIcon={ScanIcon}
      />
      <TextSeparator>OR</TextSeparator>
      <TextInput label="Server URL" value={url} onChangeText={onChangeText} />
      {error ? (
        <Typography color="error">
          We could not connect to the server
        </Typography>
      ) : null}
      <Button
        color="white"
        text="Connect"
        onPress={onPressConnect}
        disabled={disabled}
      />
    </Root>
  );
}
