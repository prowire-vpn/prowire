import * as React from 'react';
import {RouterProvider} from 'react-router-dom';
import {Init} from 'base/components/Init';
import {Provider} from 'base/components/Provider';
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
