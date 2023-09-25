import AsyncStorage from '@react-native-async-storage/async-storage';

export function getItem(key: string) {
  return AsyncStorage.getItem(key);
}

export function storeItem(key: string, item: string) {
  return AsyncStorage.setItem(key, item);
}

export function clearItem(key: string) {
  return AsyncStorage.removeItem(key);
}
