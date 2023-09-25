import * as React from 'react';
import {type RouteObject} from 'react-router-dom';
import {ServerListPage} from 'server/pages';

export const serverRoutes: Array<RouteObject> = [
  {
    path: '',
    element: <ServerListPage />,
  },
];
