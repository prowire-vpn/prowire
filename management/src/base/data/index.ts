import {QueryClient} from 'react-query';

export const queryClient = new QueryClient();

export * from './hooks';
export * from './client';
export type {GetClientConfigResponseBody} from './api';
