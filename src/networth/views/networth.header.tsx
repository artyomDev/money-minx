import React from 'react';
import { Link } from 'react-router-dom';

import Logo from 'assets/icons/logo.svg';
import { useAuthState } from 'auth/auth.context';
import { capitalize } from 'common/common-helper';
import ProBadge from 'assets/images/networth/pro-badge.svg';
import DefaultAvatar from 'assets/icons/default-avatar.svg';

interface NetworthHeaderProps {
  toggleMenu: () => void;
}
const NetworthHeader: React.FC<NetworthHeaderProps> = ({ toggleMenu }) => {
  const { user } = useAuthState();
  return (
    <header>
      <nav className='navbar navbar-expand-lg money-minx-header'>
        <div className='container'>
          <button
            className='navbar-toggler collapsed'
            type='button'
            data-toggle='collapse'
            data-target='#headerMenu'
            aria-expanded='false'
          >
            <span className='navbar-toggler-icon' />
          </button>
          <Link to='/' className='navbar-brand'>
            <img src={Logo} alt='Money Minx logo' />
          </Link>
          <div className='headtab'>
            <Link to='#' className='active'>
              Net Worth
            </Link>
            <Link to='#'>Allocation</Link>
          </div>
          <div className='head-right'>
            <button type='button' className='upgrader-btn' data-toggle='modal' data-target='#upgradeModal'>
              Upgrade
            </button>
            <div className='badge-box'>
              <Link to='#'>
                <img src={ProBadge} alt='Pro badge' />
              </Link>
            </div>
            <div className='btn-group'>
              <button type='button' className='profile-toggle' onClick={toggleMenu}>
                <span>
                  <img src={user?.picture || DefaultAvatar} alt='Profile avatar' />
                </span>
                <span>{capitalize(user?.firstName || 'User')}</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default NetworthHeader;
