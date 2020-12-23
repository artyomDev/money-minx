import useFetch from 'common/hooks/useFetch';
import { getLoanAccounts } from 'api/request.api';

interface ILoanAccount {
  id: number;
  balance: number;
  accountName: string;
}

const useLoanAccount = () => {
  const { res, loading } = useFetch(getLoanAccounts, {});
  return { fetchingLoanAccount: loading, loanAccounts: res?.data as ILoanAccount[], loanAccountError: res?.error };
};

export default useLoanAccount;
