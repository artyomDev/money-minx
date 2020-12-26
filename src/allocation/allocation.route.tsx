import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';

import AuthorizedProvider from 'provider/authorized.provider';

import Allocation from './views/allocation';
import { AllocationProvider } from './allocation.context';

function AllocationRoute() {
  return (
    <AllocationProvider>
      <AuthorizedProvider>
        <Switch>
          <Route exact path='/allocation' component={Allocation} />
          <Route exact path='/allocation/404' component={NotFound} />
          <Redirect to='/allocation/404' />
        </Switch>
      </AuthorizedProvider>
    </AllocationProvider>
  );
}

function NotFound() {
  return <div>NOT FOUND </div>;
}

export default AllocationRoute;
