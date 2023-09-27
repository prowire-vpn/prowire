import {useEffect} from 'react';
import {NativeModules, Platform} from 'react-native';
import OpenVpn, {addVpnStateListener, removeVpnStateListener} from 'react-native-simple-openvpn';
import {useQuery, UseQueryOptions, useMutation, UseMutationOptions} from 'react-query';
import {useVpn, useVpnDispatch} from 'vpn/state';
import {buildOpenVpnConfig, VpvStartConfig} from 'vpn/utils';

export const NATIVE_KEY_PAIR_CACHE_KEY = 'native_key_pair';
export const NATIVE_START_VPN_CACHE_KEY = 'native_start_vpn';
export const NATIVE_STOP_VPN_CACHE_KEY = 'native_stop_vpn';

export interface KeyPair {
  privateKey: string;
  publicKey: string;
}

export function useGenerateKeyPair(
  options?: Omit<UseQueryOptions<KeyPair>, 'queryKey' | 'queryFn'>,
) {
  return useQuery(
    NATIVE_KEY_PAIR_CACHE_KEY,
    () => {
      if (Platform.OS === 'web') {
        return window.electron.ipcRenderer.invoke<KeyPair>('crypto:generateKeyPair');
      }
      return NativeModules.CryptoModule.createKeyPair();
    },
    options,
  );
}

function mapOpenVpnState(state: number) {
  switch (state) {
    case 0: {
      return 'disconnected';
    }
    case 1: {
      return 'connecting';
    }
    case 2: {
      return 'connected';
    }
    case 3: {
      return 'disconnecting';
    }
    default: {
      return 'other';
    }
  }
}

export function useStartVpn(
  options?: Omit<UseMutationOptions<void, unknown, VpvStartConfig>, 'queryKey' | 'queryFn'>,
) {
  const {state} = useVpn();
  const dispatch = useVpnDispatch();

  useEffect(() => {
    if (Platform.OS === 'web') {
      return;
    }
    addVpnStateListener(({state: newStateRaw}) => {
      const newState = mapOpenVpnState(newStateRaw);
      if (state !== newState) {
        dispatch({type: 'state', payload: newState});
      }
    });
    return () => {
      removeVpnStateListener();
    };
  }, [dispatch, state]);

  return useMutation(
    NATIVE_START_VPN_CACHE_KEY,
    async (config: VpvStartConfig) => {
      if (Platform.OS === 'web') {
        console.log(config);
        return;
      }
      OpenVpn.connect({
        ovpnString: buildOpenVpnConfig(config),
        providerBundleIdentifier: 'com.apple.networkextension.openvpn',
      });
    },
    options,
  );
}

export function useStopVpn(options?: Omit<UseMutationOptions, 'queryKey' | 'queryFn'>) {
  return useMutation(
    NATIVE_STOP_VPN_CACHE_KEY,
    async () => {
      if (Platform.OS === 'web') {
        return;
      }
      OpenVpn.disconnect();
    },
    options,
  );
}
