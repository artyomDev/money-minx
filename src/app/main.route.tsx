import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { Login, Signup } from 'auth';
import AuthRoute from 'auth/auth.route';
import WebsiteRoute from 'website/website.route';
import {
  Home,
  About,
  Notice,
  Privacy,
  Pricing,
  Security,
  TermNService,
  FeaturesCryptos,
  FeaturesNetWorth,
  FeaturesAllocations,
  FeaturesSyncedManual,
  FeaturesMulticurrency,
  FeaturesTransactionHistory,
} from 'website/views';
import { ForgotPassword } from 'auth/views';
import Community from 'community/community';

import AppRoute from './app.route';
import { ResetPassword, TokenExpired } from './app.view';
import { appRouteConstants } from './app-route.constant';

const {
  home,
  web: { SECURITY, ABOUT, TERMS, NOTICES, PRIVACY, PRICING },
  features: {
    FEATURES_CRYPTOS,
    FEATURES_NET_WORTH,
    FEATURES_ALLOCATIONS,
    FEATURES_SYNCED_MANUAL,
    FEATURES_MULTICURRENCY,
    FEATURES_TRANSACTION_HISTORY,
  },
  auth: { DEF, LOGIN, SIGNUP, FORGOT_PASSWORD, TOKEN_EXPIRED, RESET_PASSWORD },
  community: {COMMUNITY}
} = appRouteConstants;

function MainRoute() {
  return (
    <>
      <Switch>
        <Route exact path={home}>
          <Home />
        </Route>

        <Route path='/w'>
          <WebsiteRoute />
        </Route>

        <Route path={DEF}>
          <AuthRoute />
        </Route>

        <Route exact path={ABOUT} component={About} />
        <Route exact path={LOGIN} component={Login} />
        <Route exact path={SIGNUP} component={Signup} />
        <Route exact path={NOTICES} component={Notice} />
        <Route exact path={PRIVACY} component={Privacy} />
        <Route exact path={PRICING} component={Pricing} />
        <Route exact path={TERMS} component={TermNService} />
        <Route exact path={SECURITY} component={Security} />
        <Route exact path={FORGOT_PASSWORD} component={ForgotPassword} />
        <Route exact path={TOKEN_EXPIRED} component={TokenExpired} />
        <Route exact path={RESET_PASSWORD} component={ResetPassword} />

        <Route exact path={FEATURES_CRYPTOS} component={FeaturesCryptos} />
        <Route exact path={FEATURES_NET_WORTH} component={FeaturesNetWorth} />
        <Route exact path={FEATURES_ALLOCATIONS} component={FeaturesAllocations} />
        <Route exact path={FEATURES_SYNCED_MANUAL} component={FeaturesSyncedManual} />
        <Route exact path={FEATURES_MULTICURRENCY} component={FeaturesMulticurrency} />
        <Route exact path={FEATURES_TRANSACTION_HISTORY} component={FeaturesTransactionHistory} />
        <Route exact path={COMMUNITY} component={Community} />

        <Route path='/'>
          <AppRoute />
        </Route>
      </Switch>
    </>
  );
}

export default MainRoute;
