import * as React from 'react';
import {createBrowserRouter} from 'react-router-dom';
import {authRoutes} from 'auth/router';
import {Layout} from 'base/components/Layout';
import {serverRoutes} from 'server/router';
import {userRoutes} from 'user/router';

/** Main application router */
export const router: ReturnType<typeof createBrowserRouter> = createBrowserRouter([
  {
    path: 'auth',
    children: authRoutes,
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: 'user',
        children: userRoutes,
      },
      {
        path: 'server',
        children: serverRoutes,
      },
    ],
  },
]);
