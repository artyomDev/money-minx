import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';

import { NotFound } from 'website/views';
import AuthorizedProvider from 'provider/authorized.provider';

import AccountDetail from './views/account-detail';
import { AccountProvider } from './account.context';

function AccountRoute() {
  return (
    <AccountProvider>
      <AuthorizedProvider>
        <Switch>
          <Route exact path='/account-details/:accountId' component={AccountDetail} />
          <Route exact path='/account-detail/404' component={NotFound} />
          <Redirect to='/account/404' />
        </Switch>
      </AuthorizedProvider>
    </AccountProvider>
  );
}

export default AccountRoute;
