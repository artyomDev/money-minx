import React, { useState } from 'react';

import AppHeader from 'common/app.header';
import FooterSection from 'auth/views/auth.footer';
import useAllocation from 'allocation/hooks/useAllocation';
import { AllocationsFilter } from 'allocation/allocation.enum';
import CircularSpinner from 'common/components/spinner/circular-spinner';

import { AllocationProps } from '../allocation.type';
import AllocationOverview from './allocation-overview';
import AllocationSubNavigation from './allocation-sub-navigation';

const Allocation: React.FC<AllocationProps> = () => {
  const [openNav, setOpenNav] = useState<boolean>(false);
  const [filter, setFilter] = useState(AllocationsFilter.TYPE);
  const { fetching, allocations, error, allocationChartData } = useAllocation(filter);

  if (fetching || error || !allocations || !allocationChartData) {
    return <CircularSpinner />;
  }

  const handleTypeChange = (type: AllocationsFilter) => {
    setFilter(type);
  };

  return (
    <div className='mm-setting mm-allocation'>
      <AppHeader toggleMenu={() => setOpenNav(!openNav)} />
      <AllocationSubNavigation onTypeChange={handleTypeChange} filter={filter} />
      <AllocationOverview allocations={allocations} chartData={allocationChartData} filter={filter} />
      <FooterSection />
    </div>
  );
};

export default Allocation;
