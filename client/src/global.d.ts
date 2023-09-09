import {ElectronHandler} from './preload';
import 'react-native';

declare global {
  interface Window {
    electron: ElectronHandler;
    cryptoModule: CryptoModuleInterface;
  }
}

interface CryptoModuleInterface {
  createKeyPair: () => Promise<{privateKey: string; publicKey: string}>;
}

declare module 'react-native' {
  interface NativeModulesStatic {
    CryptoModule: CryptoModuleInterface;
  }
}

export {};
