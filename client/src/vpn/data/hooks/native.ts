import {NativeModules, Platform} from 'react-native';
import {useQuery, UseQueryOptions} from 'react-query';

export const NATIVE_KEY_PAIR_CACHE_KEY = 'native_key_pair_local';

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
        return window.electron.ipcRenderer.invoke<KeyPair>(
          'crypto:generateKeyPair',
        );
      }
      return NativeModules.CryptoModule.createKeyPair();
    },
    options,
  );
}
