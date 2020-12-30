import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import { logout } from 'auth/auth.service';
import { ReactComponent as Logout } from 'assets/icons/logout.svg';
import { ReactComponent as Upgrade } from 'assets/icons/upgrade.svg';
import { ReactComponent as Profile } from 'assets/icons/profile.svg';
import { ReactComponent as Support } from 'assets/icons/support.svg';
import { ReactComponent as Settings } from 'assets/icons/settings.svg';
import { ReactComponent as ResourceCenter } from 'assets/icons/resource-center.svg';
import { ReactComponent as ManageConnection } from 'assets/icons/manage-connection.svg';

interface NetworthSidebarProps {
  openLeft: boolean;
  openRight: boolean;
}
const AppSidebar: React.FC<NetworthSidebarProps> = ({ openLeft, openRight }) => {
  const { pathname } = useLocation();
  const sidebarClass = (label: string) => (pathname.includes(label) ? 'mm-sidebar-item active' : 'mm-sidebar-item');

  return (
    <>
      <aside
        className={openRight ? 'profilemenu open-slidebar' : 'profilemenu'}
        style={{ right: openRight ? 0 : -300 }}
      >
        <ul className='prlist-up mb-0 mt-2'>
          <li>
            <Link to='/settings?active=Plan'>
              <Upgrade />
              <i className='icon-upgrade' /> Upgrade
            </Link>
          </li>
        </ul>
        <hr className='sidebar-custom-hr' />
        <ul className='prlist-pro mb-0'>
          <li>
            <Link to='/settings?active=Settings'>
              <Settings />
              <i className='icon-settings' />
              Settings
            </Link>
          </li>
          <li>
            <Link to='/settings?active=Profile'>
              <Profile />
              <i className='icon-profile' />
              Profile
            </Link>
          </li>
          <li>
            <Link to='/settings?active=Accounts'>
              <ManageConnection />
              <i className='icon-manage-connections' /> Manage Accounts
            </Link>
          </li>
          <li>
            <a href='mailto:hello@moneyminx.com?subject=Money%20Minx%20Help'>
              <Support />
              <i className='icon-support' />
              Support
            </a>
          </li>
          <li>
            <a target='_blank' href='https://www.moneyminx.com/blog' rel='noopener noreferrer'>
              <ResourceCenter />
              <i className='icon-resource-center' />
              Blog
            </a>
          </li>
        </ul>
        <hr className='sidebar-custom-hr' />
        <ul className='prlist-log mb-0'>
          <li>
            <Link to='#' onClick={logout}>
              <Logout />
              <i className='icon-logout' /> Logout
            </Link>
          </li>
        </ul>
      </aside>
      <aside className='mobmenu collapse' id='headerMenu' style={{ left: openLeft ? 0 : -300 }}>
        <div className='headtab'>
          <Link to='/net-worth' className={sidebarClass('net-worth')}>
            Net Worth
          </Link>
          <Link to='/allocation' className={sidebarClass('allocation')}>
            Allocation
          </Link>
        </div>
      </aside>
    </>
  );
};

export default AppSidebar;
