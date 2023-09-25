import {client} from './client';

export interface GetClientConfigResponseBody {
  MANAGEMENT_URL: string;
  API_URL: string;
}

export async function getClientConfig(): Promise<GetClientConfigResponseBody> {
  const {data} = await client.get<GetClientConfigResponseBody>('/config.json', {
    baseURL: '',
  });
  // Set API's url as default for future requests
  client.defaults.baseURL = data.API_URL;
  return data;
}
