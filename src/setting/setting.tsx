import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

import AppHeader from 'common/app.header';
import AppFooter from 'common/app.footer';
import AppSidebar from 'common/app.sidebar';

import PlanOverview from './pages/plan-overview';
import SettingOverview from './pages/setting-overview';
import ProfileOverview from './pages/profile-overview';
import { AccountOverview } from './pages/account-overview';
import SettingTitleSection from './partials/setting-title';
import { SettingsProps, SettingPageEnum } from './setting.type';

const Settings: React.FC<SettingsProps> = () => {
  const [page, setPage] = useState<SettingPageEnum>(SettingPageEnum.SETTINGS);
  const [openLeftNav, setOpenLeftNav] = useState<boolean>(false);
  const [openRightNav, setOpenRightNav] = useState<boolean>(false);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const activeTab = params.get('active');

  const handlePageSelect = (pageName: any) => {
    setPage(pageName);
  };

  if (activeTab)
    setTimeout(() => {
      handlePageSelect(activeTab);
    }, 100);

  const containerClass =
    page === SettingPageEnum.PLAN ? 'mm-settings-container mm-profile-container' : 'mm-settings-container';

  const renderTabContent = () => {
    switch (page) {
      case SettingPageEnum.SETTINGS: {
        return <SettingOverview changeTab={handlePageSelect} />;
      }
      case SettingPageEnum.PROFILE: {
        return <ProfileOverview />;
      }
      case SettingPageEnum.PLAN: {
        return <PlanOverview />;
      }
      case SettingPageEnum.ACCOUNTS: {
        return <AccountOverview />;
      }

      default: {
        return <AccountOverview />;
      }
    }
  };

  const closeRightNav = () => {
    setOpenRightNav(false);
  };

  return (
    <div className='mm-setting'>
      <AppHeader
        toggleLeftMenu={() => setOpenLeftNav(!openLeftNav)}
        toggleRightMenu={() => setOpenRightNav(!openRightNav)}
        open={openRightNav}
      />
      <AppSidebar openLeft={openLeftNav} openRight={openRightNav} />
      <div className='mm-slider-bg-overlay' onClick={closeRightNav} role='button' />
      <div className={containerClass}>
        <SettingTitleSection handlePageSelect={handlePageSelect} pageTitle={page} />
        {renderTabContent()}
      </div>
      <AppFooter />
    </div>
  );
};

export default Settings;
