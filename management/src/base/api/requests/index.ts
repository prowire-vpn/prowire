import {Axios} from 'axios';
import {QueryClient} from 'react-query';
import {getClientConfigGenerator} from './getClientConfig';

export const queryClient = new QueryClient();

export const axios = new Axios({
  withCredentials: true,
  validateStatus: (status) => status >= 200 && status < 300,
});

export function setAccessToken(token: string): void {
  if (!axios.defaults.headers)
    axios.defaults.headers = {
      common: {},
      delete: {},
      get: {},
      head: {},
      post: {},
      put: {},
      patch: {},
    };
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export const getClientConfig = async () => getClientConfigGenerator(axios);
export type {GetClientConfigResponseBody} from './getClientConfig';
