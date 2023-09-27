import {AppHealthResponseBodyDto} from '@prowire-vpn/api';
import {useQuery, UseQueryOptions} from 'react-query';
import {getHealth} from 'config/data/api';

export function useGetHealth(
  baseURL?: string,
  options?: Omit<UseQueryOptions<AppHealthResponseBodyDto>, 'queryKey' | 'queryFn'>,
) {
  const key = baseURL ? ['clientConfig', baseURL] : 'clientConfig';
  return useQuery<AppHealthResponseBodyDto>(key, () => getHealth(baseURL), options);
}
