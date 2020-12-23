import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import useSize from 'common/hooks/useSize';
import { ReactComponent as Logo } from 'assets/icons/logo.svg';
import { ReactComponent as MoneyMinxLogoMobile } from 'assets/icons/money-minx-logo-mobile.svg';

interface LeftMenuType {
  all: string;
  menus: string;
}
const WebsiteHeader = () => {
  const { width } = useSize();
  const { pathname } = useLocation();
  const [expand, setExpand] = useState<keyof LeftMenuType>();

  const handleToggleMenu = () => {
    if (expand) {
      setExpand(undefined);
      return;
    }

    if (width <= 768) {
      setExpand('all');
    }
  };

  const navClass = (label: string) => (pathname.includes(label) ? 'mm-nav-item active' : 'mm-nav-item');

  return (
    <nav className='mm-navbar navbar-expand-lg navbar-light'>
      <div className='logo-btn-wrapper'>
        <Link className='navbar-brand' to='/' aria-label='Money Minx'>
          <Logo role='img' aria-labelledby='mmLogoTitle mmLogoDesc'/>
        </Link>
        <div className='badge badge-pill badge-primary mm-coming-soon'>Beta</div>
      </div>

      <div className='right-menu-wrapper'>
        <div className={`${expand === 'all' ? 'expand-all nav-none' : 'expand-all nav-all'}`}>
          <div className={`menu-btn-wrapper`}>
            <div className={`menu-list-wrapper ${expand === 'menus' ? 'expand-menu' : ''}`}>
              <div className='mm-navbar-logo d-flex justify-content-between d-block d-md-none'>
                <div>
                  <MoneyMinxLogoMobile className='mr-3' />
                  <div className='badge badge-pill badge-primary mm-coming-soon'>Beta</div>
                </div>
              </div>
              <ul className='navbar-nav mr-auto navbar-menu-list' role='menubar'>
                <li className={navClass('pricing')}>
                  <Link className='mm-nav-link' to='/pricing' role='menuitem'>
                    Pricing
                  </Link>
                </li>

                <li className={navClass('blog')}>
                  <a
                    className='mm-nav-link'
                    target='_blank'
                    rel='noopener noreferrer'
                    href='https://www.moneyminx.com/blog'
                    role='menuitem'
                  >
                    Blog
                  </a>
                </li>
                <li className={navClass('about')}>
                  <Link className='mm-nav-link' to='/about' role='menuitem'>
                    About Us
                  </Link>
                </li>
                <li className={navClass('login')}>
                  <Link className='mm-nav-link' to='/login' role='menuitem'>
                    Log In
                  </Link>
                </li>
                <li className='mm-nav-item'>
                  <Link className='mm-nav-link' to='/signup' role='menuitem'>
                    <button className='w-100 mm-btn-signup btn-outline-primary mm-btn-animate mt-n2'>Sign Up</button>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className='mm-navbar-icon mr-4'>
        <div className='mm-menuToggle'>
          <input type='checkbox' onClick={handleToggleMenu} />
          <span/>
          <span/>
          <span/>
        </div>
      </div>
    </nav>
  );
};

export default WebsiteHeader;
