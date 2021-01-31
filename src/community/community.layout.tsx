import React, { useState } from 'react';

import AppHeader from 'common/app.header';
import AppFooter from 'common/app.footer';
import AppSidebar from 'common/app.sidebar';

const CommunityLayout: React.FC = ({ children }) => {
  const [openRightNav, setOpenRightNav] = useState<boolean>(false);
  const [openLeftNav, setOpenLeftNav] = useState<boolean>(false);
  const closeRightNav = () => { setOpenRightNav(false); };

  return (
    <>
      <AppHeader
        toggleLeftMenu={() => setOpenLeftNav(!openLeftNav)}
        toggleRightMenu={() => setOpenRightNav(!openRightNav)}
        open={openRightNav}
        shadow={true}
      />
      <AppSidebar openLeft={openLeftNav} openRight={openRightNav} />
      <div className='mm-slider-bg-overlay' onClick={closeRightNav} role='button' />
      {children}
      <AppFooter />
    </>
  );
};

export default CommunityLayout;
