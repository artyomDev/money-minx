import React, { useEffect, useState } from 'react';

import LoadingScreen from 'common/loading-screen';
import { logger } from 'common/logger.helper';
/**
 * This layout will be used to include all the pages
 * 1. have correct permissions
 * 2. have correct plan
 */
const AuthorizedLayout: React.FC = ({ children }) => {
  const [authorized, setAuthorized] = useState(false);
  /**
   * logic to check whether user have correct plan or not
   */
  useEffect(() => {
    const timeout = setTimeout(() => {
      setAuthorized(true);
    }, 300);

    return () => clearTimeout(timeout);
  }, []);

  logger.log('Authorized', authorized);

  if (!authorized) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
};

export default AuthorizedLayout;
