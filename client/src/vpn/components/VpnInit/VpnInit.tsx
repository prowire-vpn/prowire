import {PropsWithChildren} from 'react';
import * as React from 'react';
import {useGenerateKeyPair} from 'vpn/data';
import {useVpn, useVpnDispatch} from 'vpn/state';

export function VpnInit({children}: PropsWithChildren) {
  const {publicKey, privateKey} = useVpn();
  const dispatch = useVpnDispatch();

  useGenerateKeyPair({
    enabled: !publicKey || !privateKey,
    suspense: true,
    onSuccess: keyPair => {
      dispatch({type: 'keyPair', payload: keyPair});
    },
  });

  return <>{children}</>;
}
