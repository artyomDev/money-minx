import React from 'react';
import { NotFound } from 'website/views';
import { Switch, Redirect, Route } from 'react-router-dom';

import { authRouteConstants } from './authRouteConstants';
import { Login, Signup, ExpiredLink, SessionExpired, ConnectAccount, AccountSetting, CreateNewPassword } from './views';

const {
  LOGIN,
  SIGNUP,
  NOT_FOUND,
  EXPIRED_LINK,
  SESSION_EXPIRED,
  CONNECT_ACCOUNT,
  ACCOUNT_SETTING,
  CREATE_NEW_PASSWORD,
} = authRouteConstants;
const AuthRoute = () => {
  return (
    <Switch>
      <Route exact path={LOGIN} component={Login} />
      <Route exact path={SESSION_EXPIRED} component={SessionExpired} />
      <Route exact path={CREATE_NEW_PASSWORD} component={CreateNewPassword} />
      <Route exact path={EXPIRED_LINK} component={ExpiredLink} />
      <Route exact path={CONNECT_ACCOUNT} component={ConnectAccount} />
      <Route exact path={ACCOUNT_SETTING} component={AccountSetting} />
      <Route exact path={NOT_FOUND} component={NotFound} />
      <Route exact path={SIGNUP} component={Signup} />
      <Redirect to={NOT_FOUND} />
    </Switch>
  );
};

export default AuthRoute;
