import { useState } from 'react';

import useToast from 'common/hooks/useToast';
import { useAuthDispatch } from 'auth/auth.context';
import { setAccountSuccess } from 'auth/auth.actions';
import { getAccount, getLatestProviderAccounts, getNewAccounts } from 'api/request.api';

/**
 * Each account related functions and data will reside here
 * for now we will have single fetch new account method
 */
const useAccounts = () => {
  const { mmToast } = useToast();
  const dispatch = useAuthDispatch();
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>();

  return {
    fetchNewAccounts: async () => {
      setLoading(true);
      const { error, data } = await getNewAccounts();
      setLoading(false);
      if (error) {
        return mmToast('Error occurred on fetching new Accounts', { type: 'error' });
      }
      dispatch(setAccountSuccess(data));
      setAccounts(data);
    },
    fetchLatestProviderAccounts: async () => {
      setLoading(true);
      const { error, data } = await getLatestProviderAccounts();
      setLoading(false);
      if (error) {
        return mmToast('Error occurred on fetching latest provider accounts', { type: 'error' });
      }
      dispatch(setAccountSuccess(data));
      setAccounts(data);
    },
    fetchAccounts: async () => {
      setLoading(true);
      const { error, data } = await getAccount();
      setLoading(false);
      if (error) {
        return mmToast('Error occurred on fetching Account', { type: 'error' });
      }
      dispatch(setAccountSuccess(data));
      setAccounts(data);
    },
    loading,
    accounts,
  };
};

export default useAccounts;
