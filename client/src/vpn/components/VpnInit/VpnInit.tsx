import {PropsWithChildren} from 'react';
import * as React from 'react';
import {useGenerateKeyPair, useGetKeyPair} from 'vpn/data';
import {useVpn, useVpnDispatch} from 'vpn/state';

export function VpnInit({children}: PropsWithChildren) {
  const {publicKey, privateKey} = useVpn();
  const dispatch = useVpnDispatch();
  const {isSuccess} = useGetKeyPair({
    enabled: !publicKey || !privateKey,
    suspense: true,
    onSuccess: keyPair => {
      if (keyPair) {
        dispatch({type: 'keyPair', payload: keyPair});
      }
    },
  });

  useGenerateKeyPair({
    enabled: isSuccess && (!publicKey || !privateKey),
    suspense: true,
    onSuccess: keyPair => {
      console.log(keyPair);
      dispatch({type: 'keyPair', payload: keyPair});
    },
  });

  return <>{children}</>;
}
