import {isAxiosError} from 'axios';

export const isAuthError = (err: unknown) =>
  isAxiosError(err) && [401, 403].includes(err?.response?.status ?? 0);
