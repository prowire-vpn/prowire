import {Axios} from 'axios';

export interface GetHealthResponseBody {
  healthy: boolean;
}

export async function getHealthGenerator(
  axios: Axios,
): Promise<GetHealthResponseBody> {
  const {data} = await axios.get<GetHealthResponseBody>('/health');
  return data;
}
