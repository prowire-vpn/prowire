export function getItem(key: string) {
  return localStorage.getItem(key);
}

export function storeItem(key: string, item: string) {
  localStorage.setItem(key, item);
}

export function clearItem(key: string) {
  localStorage.removeItem(key);
}
