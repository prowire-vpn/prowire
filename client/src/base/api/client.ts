import axios from 'axios';
import {QueryClient} from 'react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {useErrorBoundary: false},
    mutations: {useErrorBoundary: false},
  },
});

export const client = axios.create({
  ...axios.defaults,
  withCredentials: true,
});

export function setAccessToken(token: string): void {
  client.defaults.headers.common.Authorization = `Bearer ${token}`;
}

export function setBaseUrl(url: string): void {
  client.defaults.baseURL = url;
}
