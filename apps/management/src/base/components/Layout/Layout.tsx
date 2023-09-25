import {Grid, GridItem} from '@chakra-ui/react';
import * as React from 'react';
import {Outlet} from 'react-router-dom';
import {useAuthenticated} from 'auth/hooks';
import {Navigation} from 'base/components/Navigation';

export function Layout() {
  useAuthenticated({requireAuthentication: true});
  return (
    <Grid templateColumns="1fr 5fr">
      <GridItem>
        <Navigation />
      </GridItem>
      <GridItem padding={6}>
        <Outlet />
      </GridItem>
    </Grid>
  );
}
