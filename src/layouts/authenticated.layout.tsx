import React, { useEffect } from 'react';

/**
 * @description this layout will be used to wrap up the authenticated pages
 * all the pages which can be accessed once the user is logged in.
 */

const AuthenticatedLayout: React.FC = ({ children }) => {
  useEffect(() => {
    // check if user is authenticated
  }, []);
  return <div>{children}</div>;
};

export default AuthenticatedLayout;
