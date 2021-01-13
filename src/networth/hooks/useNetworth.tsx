import { useEffect, useState } from 'react';

import { getNetworth } from 'api/request.api';
import { TimeIntervalEnum } from 'networth/networth.enum';
import { NetworthItem, NetworthType } from 'networth/networth.type';
import { setAccounts, setNetWorth } from 'networth/networth.actions';
import { parseAccountDetails, parseIntervalList } from 'common/interval-parser';
import { useNetworthDispatch, useNetworthState } from 'networth/networth.context';
import { getUTC } from 'common/moment.helper';

const useNetworth = () => {
  const dispatch = useNetworthDispatch();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<NetworthType>();

  const {
    fTypes,
    fAccounts,
    fCategories,
    fToDate: toDate,
    fFromDate: fromDate,
    fTimeInterval: timeInterval,
  } = useNetworthState();

  const accountType = fTypes.length ? fTypes.toString() : undefined;
  const category = fCategories.length ? fCategories.toString() : undefined;
  const accountId = fAccounts.length ? fAccounts.toString() : undefined;

  useEffect(() => {
    const fetchNetworth = async () => {
      setLoading(true);

      const { data, error: networthError } = await getNetworth({
        accountType,
        timeInterval,
        category,
        fromDate: fromDate ? getUTC(fromDate) : undefined,
        toDate: toDate ? getUTC(toDate) : undefined,
        accountId,
      });

      const isQuarter = timeInterval === TimeIntervalEnum.QUARTERLY;

      if (networthError) {
        setLoading(false);

        return setError(networthError);
      }

      if (data?.networth) {
        const parsedNetworth: NetworthItem[] = parseIntervalList(data.networth, isQuarter) as any;
        dispatch(setNetWorth(parsedNetworth));
      }

      if (data?.accounts) {
        const parsedAccountDetails = parseAccountDetails(data.accounts, isQuarter);

        dispatch(setAccounts(parsedAccountDetails));
      }

      setLoading(false);

      return setResponse(data);
    };

    fetchNetworth();
  }, [accountType, timeInterval, category, fromDate, dispatch, toDate, accountId]);

  return {
    loading,
    error,
    accounts: response?.accounts,
    networth: response?.networth,
    accountWithIssues: response?.accountWithIssues,
  };
};

export default useNetworth;
