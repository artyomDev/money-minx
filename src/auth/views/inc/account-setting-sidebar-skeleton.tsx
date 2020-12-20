import React from 'react';
import Skeleton from 'react-loading-skeleton';

const AccountSettingSidebarSkeleton = () => {
  return (
    <div className='bg-white credentials-wrapper account-setting'>
      <div className='credentials-content'>
        <div className='top-content-wrap'>
          <h2>
            <Skeleton count={1} />
          </h2>
          <p>
            <Skeleton count={3} />
          </p>
        </div>
        <div className='form-wrap'>
          <ul className='bank-list'>
            <li role='button'>
              <Skeleton width={120} height={80} />
            </li>
            <li role='button'>
              <Skeleton width={120} height={80} />
            </li>
          </ul>
          <div className='form-heading'>
            <Skeleton count={20} />
          </div>
          <p className='flex-box learn-more-security'>
            <Skeleton count={1} />
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccountSettingSidebarSkeleton;
