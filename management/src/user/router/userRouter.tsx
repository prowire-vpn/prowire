import * as React from 'react';
import {RouteObject} from 'react-router-dom';
import {UserListPage} from 'user/pages';

export const userRoutes: Array<RouteObject> = [
  {
    path: '',
    element: <UserListPage />,
  },
];
