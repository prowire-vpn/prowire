import {QueryClient} from 'react-query';

export * from './api';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {useErrorBoundary: false},
    mutations: {useErrorBoundary: false},
  },
});
