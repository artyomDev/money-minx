import useFetch from 'common/hooks/useFetch';
import { IRealEstateAccount } from 'auth/auth.types';
import { getRealEstateAccounts } from 'api/request.api';

const useRealEstateAccounts = () => {
  const { res, loading } = useFetch(getRealEstateAccounts, {});

  return {
    realEstateError: res?.error,
    fetchingRealEstateAccounts: loading,
    realEstateAccounts: res?.data as IRealEstateAccount[],
  };
};

export default useRealEstateAccounts;
