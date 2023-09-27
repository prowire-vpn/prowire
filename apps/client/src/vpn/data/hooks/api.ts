import {ConnectServerResponseBodyDto} from '@prowire-vpn/api';
import {useMutation, UseMutationOptions} from 'react-query';
import {postServerConnect} from 'vpn/data/api';

export function useServerConnect(
  publicKey: string,
  options?: Omit<UseMutationOptions<ConnectServerResponseBodyDto>, 'queryKey' | 'queryFn'>,
) {
  return useMutation<ConnectServerResponseBodyDto>(
    ['clientConfig', publicKey],
    () => postServerConnect(publicKey),
    options,
  );
}
