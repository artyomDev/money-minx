import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { logger } from 'common/logger.helper';
import useSubscriptionValidation from 'auth/hooks/useSubscriptionValidation';

const AuthorizedRoute = ({ component: Component, ...rest }: any) => {
  const { accessibleRoute } = useSubscriptionValidation();

  logger.log('Accessible Routes', accessibleRoute);

  return (
    <Route
      {...rest}
      render={(props) => {
        logger.log('props here', props);

        const allAllowed = accessibleRoute.includes('all');
        const [allowed] = accessibleRoute;

        return allAllowed ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: allowed,
              state: { from: props.location },
            }}
          />
        );
      }}
    />
  );
};

export default AuthorizedRoute;
