import React from 'react';
import { Redirect } from 'react-router-dom';

import LoadingScreen from 'common/loading-screen';
import useSubscriptionValidation from 'auth/hooks/useSubscriptionValidation';

const AuthorizedProvider: React.FC = ({ children }) => {
  const { accessibleRoute } = useSubscriptionValidation();

  const hasAllAccess = accessibleRoute === 'all';

  if (!accessibleRoute) {
    return <LoadingScreen />;
  }

  if (!hasAllAccess) {
    return <Redirect to={accessibleRoute} />;
  }

  return <>{children}</>;
};

export default AuthorizedProvider;
