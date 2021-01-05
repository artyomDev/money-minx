import React from 'react';
import { Link } from 'react-router-dom';

const AppFooter = () => {
  return (
    <div className='container-fluid mm-container-final footer-second'>
      <div className='row'>
        <div className='footer-table-wrapper'>
          <div className='footer-content'>
            <div className='copyright-text'>© 2020-{(new Date().getFullYear())} Money Minx, LLC. All Rights Reserved.</div>
          </div>
          <div className='footer-content right-content'>
            <ul className='footer-list'>
              <li className='my-3 my-md-0'>
                <Link to='/privacy'>Privacy Policy</Link>
              </li>
              <li className='my-3 my-md-0'>
                <Link to='/terms'>Terms of Service</Link>
              </li>
              <li className='my-1 my-md-0'>
                <Link to='/notices'>Notices</Link>
              </li>
              <li className='my-1 my-md-0'>
                <Link to='/security'>Security</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppFooter;
