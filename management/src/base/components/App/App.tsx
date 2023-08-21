import * as React from 'react';
import {RouterProvider} from 'react-router-dom';
import {Provider} from 'base/components/Provider';
import {Init} from 'base/init';
import {router} from 'base/router';

/** Base app component */
export function App() {
  return (
    <Provider>
      <Init>
        <RouterProvider router={router} />
      </Init>
    </Provider>
  );
}
