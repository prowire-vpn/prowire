import * as React from 'react';
import {type PropsWithChildren, Suspense} from 'react';
import {AuthInit} from 'auth/components';
import {ConfigInit} from 'base/components/ConfigInit';
import {FullPageLoader} from 'base/components/FullPageLoader';

/** Component that runs all checks before showing the main app */
export function Init({children}: PropsWithChildren) {
  return (
    <Suspense fallback={<FullPageLoader />}>
      <ConfigInit>
        <AuthInit>{children}</AuthInit>
      </ConfigInit>
    </Suspense>
  );
}
