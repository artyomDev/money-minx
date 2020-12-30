import { IRealEstateAccount, Mortgage } from 'auth/auth.types';

export const initialMortgage: Mortgage = {
  id: '',
  principalBalance: 0,
  balance: 0,
  accountName: '',
};

export const initialAccount: IRealEstateAccount = {
  id: '',
  accountName: '',
  balance: '',
};
