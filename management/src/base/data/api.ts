import {decode} from 'ini';
import {client} from './client';

export interface GetClientConfigResponseBody {
  MANAGEMENT_URL: string;
  API_URL: string;
}

export async function getClientConfig(): Promise<GetClientConfigResponseBody> {
  const {data: iniContent} = await client.get<string>('/config.ini', {
    baseURL: '',
    responseType: 'text',
  });
  const config = decode(iniContent) as GetClientConfigResponseBody;
  // Set API's url as default for future requests
  client.defaults.baseURL = config.API_URL;
  return config;
}
