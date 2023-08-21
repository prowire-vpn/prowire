import {Axios} from 'axios';
import {decode} from 'ini';

export interface GetClientConfigResponseBody {
  API_URL: string;
}

export async function getClientConfigGenerator(axios: Axios): Promise<GetClientConfigResponseBody> {
  const {data: iniContent} = await axios.get<string>('/config.ini', {
    baseURL: '',
    responseType: 'text',
  });
  const config = decode(iniContent) as GetClientConfigResponseBody;
  // Set API's url as default for future requests
  axios.defaults.baseURL = config.API_URL;
  return config;
}
