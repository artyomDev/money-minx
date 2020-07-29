import React, { useState } from 'react';
import useSize from 'common/hooks/useSize';
import { ReactComponent as Logo } from 'assets/icons/logo.svg';

interface LeftMenuType {
  all: string;
  menus: string;
}
const WebsiteHeader = () => {
  const { width } = useSize();
  const [expand, setExpand] = useState<keyof LeftMenuType>();

  const handleToggleMenu = () => {
    if (expand) {
      setExpand(undefined);
      return;
    }
    if (width > 576 && width <= 768) {
      setExpand('menus');
    }
    if (width <= 575) {
      setExpand('all');
    }
  };

  return (
    <nav className='navbar navbar-expand-lg navbar-light bg-light'>
      <div className='logo-btn-wrapper'>
        <a className='navbar-brand' href='/'>
          <Logo />
        </a>
        <button className='btn b-primary-light'>Beta</button>
      </div>

      <div className={`left-menu-wrapper`}>
        <div className={`${expand === 'all' ? 'expand-all' : ''}`}>
          <div className={`menu-btn-wrapper`}>
            <div className={`menu-list-wrapper ${expand === 'menus' ? 'expand-menu' : ''}`}>
              <ul className='navbar-nav mr-auto navbar-menu-list'>
                <li className='nav-item active'>
                  <a className='nav-link' href='/pricing'>
                    Pricing
                  </a>
                </li>
                <li className='nav-item active'>
                  <a className='nav-link' href='/velocity'>
                    Velocity
                  </a>
                </li>
                <li className='nav-item active'>
                  <a className='nav-link' href='/about'>
                    About
                  </a>
                </li>
              </ul>
            </div>
            <div className='auth-btn-wrapper mr-1'>
              <ul className='navbar-nav'>
                <li className='nav-item active'>
                  <a className='nav-link' href='/login'>
                    Login
                  </a>
                </li>
                <li>
                  <a className='nav-link' href='/signup'>
                    <button className='btn btn-outline-primary'>Sign Up</button>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <button className='navbar-toggler' type='button' onClick={handleToggleMenu}>
          <span className='navbar-toggler-icon' />
        </button>
      </div>
    </nav>
  );
};

export default WebsiteHeader;