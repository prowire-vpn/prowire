import axios from 'axios';

export const client = axios.create({
  ...axios.defaults,
  withCredentials: true,
  validateStatus: (status) => status >= 200 && status < 300,
});

export function setAccessToken(token: string): void {
  client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}
