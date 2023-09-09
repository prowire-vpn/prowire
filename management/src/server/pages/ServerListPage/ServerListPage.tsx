import * as React from 'react';
import {FullPageLoader} from 'base/components';
import {ServerCards} from 'server/components';
import {useFindServer} from 'server/data';

export function ServerListPage() {
  const {isLoading, error, data} = useFindServer();
  if (isLoading) return <FullPageLoader />;
  if (error) return <p>Error: {error.toString()}</p>;
  return <ServerCards servers={data?.servers} />;
}
