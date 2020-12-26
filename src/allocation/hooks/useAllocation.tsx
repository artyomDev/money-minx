import { useEffect, useState } from 'react';

import { Account } from 'auth/auth.types';
import { getAllocations } from 'api/request.api';
import useMounted from 'common/hooks/useMounted';
import { getUTCString } from 'common/moment.helper';
import { AllocationsFilter } from 'allocation/allocation.enum';
import { Allocations, ChartData } from 'allocation/allocation.type';

const useAllocation = (filter: AllocationsFilter = AllocationsFilter.TYPE, forDate?: Date) => {
  const [error, setError] = useState();
  const mounted = useMounted().current;
  const [fetching, setFetching] = useState<boolean>(false);
  const [allocations, setAllocations] = useState<Allocations>();
  const [lastAvailableDate, setLastAvailableDate] = useState<Date>();
  const [allocationChartData, setAllocationChartData] = useState<ChartData>();
  const [accountWithIssues, setAccountWithIssues] = useState<Account[]>([]);

  useEffect(() => {
    const fetchAllocations = async () => {
      setFetching(true);
      const params = {
        filter,
        forDate: getUTCString(forDate),
      };

      const { data, error: err } = await getAllocations(params);
      setFetching(false);

      if (!mounted) {
        return;
      }

      if (!err) {
        if (data?.allocations) {
          setAllocations(data.allocations);
        }

        if (data?.lastAvailableDate) {
          setLastAvailableDate(new Date(data.lastAvailableDate));
        }

        if (data?.chartData) {
          setAllocationChartData(data.chartData);
        }

        if (data?.accountWithIssues) {
          setAccountWithIssues(data.accountWithIssues);
        }

        return data;
      }

      return setError(err.message || 'Error on fetching Allocations');
    };

    fetchAllocations();
  }, [filter, forDate, mounted]);

  return { fetching, error, allocations, allocationChartData, lastAvailableDate, accountWithIssues };
};

export default useAllocation;
