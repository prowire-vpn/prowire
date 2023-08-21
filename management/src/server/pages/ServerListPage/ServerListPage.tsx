import * as React from 'react';
import {ServerCards} from './ServerCards';
import {FullPageLoader} from 'base/components';
import {useFindServer} from 'server/api';

export function ServerListPage() {
  const {isLoading, error, data} = useFindServer();
  if (isLoading) return <FullPageLoader />;
  if (error) return <p>Error: {error.toString()}</p>;
  return <ServerCards servers={data?.servers} />;
}
