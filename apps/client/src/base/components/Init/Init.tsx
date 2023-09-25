import {PropsWithChildren, Suspense} from 'react';
import * as React from 'react';
import {AuthInit} from 'auth/components';
import {PageLoader} from 'base/components';
import {ConfigInit} from 'config/components';
import {VpnInit} from 'vpn/components';

export function Init({children}: PropsWithChildren) {
  return (
    <Suspense fallback={<PageLoader />}>
      <ConfigInit>
        <AuthInit>
          <VpnInit>{children}</VpnInit>
        </AuthInit>
      </ConfigInit>
    </Suspense>
  );
}
