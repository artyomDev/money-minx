import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import Setting from 'setting/setting';
import { NotFound } from 'website/views';
import useProfile from 'auth/hooks/useProfile';
import AccountRoute from 'account/account.route';
import NetworthRoute from 'networth/networth.route';
import AllocationRoute from 'allocation/allocation.route';
import useConnectionInfo from 'common/hooks/useConnectionInfo';

import {
  ResetPassword,
  StripeSuccess,
  StripeFailure,
  AccountSetting,
  ConnectAccount,
  Subscription,
  SubscriptionReview,
} from './app.view';
import PrivateRoute from './app.private-route';
import { appRouteConstants } from './app-route.constant';

const {
  account: { ACCOUNT },
  settings: { SETTINGS },
  subscription: { SUBSCRIPTION, REVIEW },
  networth: { NET_WORTH },
  allocation: { ALLOCATION },
  misc: { STRIPE_FAILURE, STRIPE_SUCCESS },
  auth: { RESET_PASSWORD, CONNECT_ACCOUNT, ACCOUNT_SETTING },
} = appRouteConstants;

function AppRoute() {
  useProfile();
  useConnectionInfo();

  return (
    <>
      <Switch>
        <PrivateRoute path={ACCOUNT}>
          <AccountRoute />
        </PrivateRoute>

        <PrivateRoute path={ALLOCATION}>
          <AllocationRoute />
        </PrivateRoute>

        <PrivateRoute exact path={SETTINGS} component={Setting} />
        <PrivateRoute exact path={SUBSCRIPTION} component={Subscription} />
        <PrivateRoute exact path={REVIEW} component={SubscriptionReview} />
        <PrivateRoute exact path={STRIPE_SUCCESS} component={StripeSuccess} />
        <PrivateRoute exact path={STRIPE_FAILURE} component={StripeFailure} />
        <PrivateRoute exact path={RESET_PASSWORD} component={ResetPassword} />
        <PrivateRoute exact path={CONNECT_ACCOUNT} component={ConnectAccount} />
        <PrivateRoute exact path={ACCOUNT_SETTING} component={AccountSetting} />
        <PrivateRoute exact path={NET_WORTH} component={NetworthRoute} />
        <Route exact path={'/404'} component={NotFound} />
        <Redirect to='/404' />
      </Switch>
    </>
  );
}

export default AppRoute;
