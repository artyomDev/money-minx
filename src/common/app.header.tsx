import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import Logo from 'assets/icons/logo.svg';
import { BreakPoint } from 'app/app.constant';
import { useAuthState } from 'auth/auth.context';
import { capitalize } from 'common/common-helper';
import ProBadge from 'assets/badges/pro-badge.svg';
import VipBadge from 'assets/badges/vip-badge.svg';
import PlusBadge from 'assets/badges/plus-badge.svg';
import GreenBadge from 'assets/badges/green-badge.svg';
import LogoIcon from 'assets/icons/money-minx-icon.svg';
import DefaultAvatar from 'assets/icons/default-avatar.svg';
import useGetSubscription from 'auth/hooks/useGetSubscription';
import useCurrentSubscription from 'auth/hooks/useCurrentSubscription';

import useSize from './hooks/useSize';

interface AppHeaderProps {
  toggleLeftMenu: () => void;
  toggleRightMenu: () => void;
  open: boolean;
  shadow: boolean;
}
const AppHeader: React.FC<AppHeaderProps> = ({ toggleLeftMenu, toggleRightMenu, open, shadow }) => {
  const { user } = useAuthState();
  const { pathname } = useLocation();
  const { width } = useSize();

  const { currentSubscription } = useCurrentSubscription();
  const { subscriptionDetail: subscription } = useGetSubscription(currentSubscription?.priceId);
  const navClass = (label: string) => (pathname.includes(label) ? 'mm-app-nav-item active' : 'mm-app-nav-item');

  const [isToggleLeft, setIsToggleLeft] = useState<boolean>(false);
  const leftClick = () => {
    toggleLeftMenu();
    setIsToggleLeft(!isToggleLeft);
  };
  return (
    <header>
      <nav className={shadow ? 'navbar navbar-expand-lg money-minx-header mm-shadow' : 'navbar navbar-expand-lg money-minx-header'}>
        <div className='container'>
          <div className='head-right'>
            <div className='d-flex'>
            <button
              className={['navbar-toggler', !isToggleLeft ? 'collapsed' : ''].join(' ')}
              type='button'
              data-toggle='collapse'
              data-target='#headerMenu'
              aria-expanded='false'
              onClick={leftClick}
            >
              <span className='navbar-toggler-icon' />
            </button>
            <Link to='/net-worth' className='navbar-brand'>
            {width >= BreakPoint.MD ? (
              <img src={Logo} alt='Money Minx Logo' className='mm-app-nav-logo' />
            ) : (
              <img src={LogoIcon} alt='Money Minx Icon' className='mm-app-nav-icon' />
            )}
          </Link>
          </div>
            <div className='headtab'>
            <Link to='/net-worth' className={navClass('net-worth')}>
              Net Worth
            </Link>
            <Link to='/allocation' className={navClass('allocation')}>
              Allocation
            </Link>
              <Link to='/community' className={navClass('allocation')}>
                Community
              </Link>
          </div>
          </div>
          <div className='head-right'>
            {currentSubscription?.subscriptionStatus === 'trialing' ||
            (subscription?.details && subscription?.details['No of connected accounts'] !== 'Unlimited') ? (
              <Link to='/settings?active=Plan' className='upgrader-btn' data-target='#upgradeModal'>
                Upgrade
              </Link>
            ) : null}
            <div className='badge-box'>
              {subscription?.details?.Name === 'Green' || subscription?.details?.Name === 'GREEN' ? (
                <img src={GreenBadge} alt='Green badge' />
              ) : null}
              {subscription?.details?.Name === 'Plus' || subscription?.details?.Name === 'PLUS' ? (
                <img src={PlusBadge} alt='Plus badge' />
              ) : null}
              {subscription?.details?.Name === 'Pro' || subscription?.details?.Name === 'PRO' ? (
                <img src={ProBadge} alt='Pro badge' />
              ) : null}
              {subscription?.details?.Name === 'Vip' || subscription?.details?.Name === 'VIP' ? (
                <img src={VipBadge} alt='Vip badge' />
              ) : null}
            </div>
            <div className='btn-group'>
              <button
                type='button'
                className={open ? 'profile-toggle open' : 'profile-toggle'}
                onClick={toggleRightMenu}
              >
                <span>
                  <img src={user?.picture || DefaultAvatar} alt='Profile avatar' />
                </span>
                <span>{capitalize(user?.firstName || user?.username || 'My Account')}</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default AppHeader;
