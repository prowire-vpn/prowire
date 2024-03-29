import * as React from 'react';
import type {RouteObject} from 'react-router-dom';
import {AuthPage, OAuthReturn} from 'auth/pages';

export const authRoutes: Array<RouteObject> = [
  {
    path: '',
    element: <AuthPage />,
  },
  {
    path: 'return',
    element: <OAuthReturn />,
  },
];
