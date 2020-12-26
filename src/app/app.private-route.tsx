import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { storage } from './app.storage';
import { appRouteConstants } from './app-route.constant';

const PrivateRoute = ({ component: Component, ...rest }: any) => {
  const isAuthenticated = storage.accessToken();

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: appRouteConstants.auth.LOGIN,
              search: '?expired=true',
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
