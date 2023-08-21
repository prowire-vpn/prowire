import * as React from 'react';
import {RouteObject} from 'react-router-dom';
import {ServerListPage} from 'server/pages';

export const serverRoutes: Array<RouteObject> = [
  {
    path: '',
    element: <ServerListPage />,
  },
];
