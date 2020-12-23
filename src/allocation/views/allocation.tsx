import React, { useState } from 'react';
import Skeleton from 'react-loading-skeleton';

import AppHeader from 'common/app.header';
import AppFooter from 'common/app.footer';
import AppSidebar from 'common/app.sidebar';
import useAllocation from 'allocation/hooks/useAllocation';
import { AllocationsFilter } from 'allocation/allocation.enum';
import CircularSpinner from 'common/components/spinner/circular-spinner';

import { AllocationProps } from '../allocation.type';
import AllocationOverview from './allocation-overview';
import AllocationSubNavigation from './allocation-sub-navigation';

const Allocation: React.FC<AllocationProps> = () => {
  const [counter, setCounter] = useState<number>(0);
  const [openLeftNav, setOpenLeftNav] = useState<boolean>(false);
  const [openRightNav, setOpenRightNav] = useState<boolean>(false);

  const [filter, setFilter] = useState(AllocationsFilter.TYPE);
  const { fetching, allocations, allocationChartData, accountWithIssues } = useAllocation(filter);

  if (!allocations || !allocationChartData) {
    return (
      <div className='mm-setting mm-allocation'>
        <AppHeader
          toggleLeftMenu={() => setOpenLeftNav(!openLeftNav)}
          toggleRightMenu={() => setOpenRightNav(!openRightNav)}
          open={openRightNav}
        />
        <div className='app-subheader-container px-4'>
          <Skeleton width={200} height={50} count={1} />
        </div>
        <div className='content-wrapper'>
          <div className='container'>
            <section className='mm-allocation-overview'>
              <div className='mm-allocation-overview__wrapper'>
                <div className='row'>
                  <div className='col-xl-4'>
                    <Skeleton width={375} height={810} />
                  </div >
                  <div className='col-xl-4'>
                    <Skeleton width={375} height={810} />
                  </div >
                  <div className='col-xl-4'>
                    <Skeleton width={375} height={810} />
                  </div >
                </div >
              </div >
            </section >
          </div >
        </div >
      </div>
    );
  }

  if (fetching && !counter) {
    return <CircularSpinner />;
  }

  const handleTypeChange = (type: AllocationsFilter) => {
    setCounter((c) => c + 1);
    setFilter(type);
  };

  const closeRightNav = () => {
    setOpenRightNav(false);
  }

  return (
    <div className='mm-setting mm-allocation'>
      <AppHeader
        toggleLeftMenu={() => setOpenLeftNav(!openLeftNav)}
        toggleRightMenu={() => setOpenRightNav(!openRightNav)}
        open={openRightNav}
      />
      <AppSidebar openLeft={openLeftNav} openRight={openRightNav} />
      <div className='mm-slider-bg-overlay' onClick={closeRightNav} />
      <AllocationSubNavigation onTypeChange={handleTypeChange} filter={filter} />
      <hr className={['mt-0', accountWithIssues.length > 0 ? '' : 'mb-4'].join(' ')} />
      <AllocationOverview allocations={allocations} chartData={allocationChartData} filter={filter} accountWithIssues={accountWithIssues} />
      <AppFooter />
    </div>
  );
};

export default Allocation;
