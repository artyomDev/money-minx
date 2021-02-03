import moment from 'moment';
import groupBy from 'lodash/groupBy';

import { IFormBalance } from './account.type';

export const groupBalanceByYear = (data: IFormBalance[]) => {
  const groupedBalance = groupBy(data, (formBalance) => getYear(formBalance.date));

  return groupedBalance;
};

export const getYear = (str: string) => str.split('-')[0];

export const parseBalanceData = <T>(data: T[]) => {
  return data.map((datum: any) => ({
    balance: datum.balance,
    date: datum.dateUTC,
  }));
};

/**
 *
 * @param interval
 * @desc This function will ensure not to pass two dates of same month.
 * This is for rendering on the UI
 */
export const getBalanceDate = (interval: string) => {
  let momentDate = moment();
  if ('Today' !== interval) {
    momentDate = moment(interval, 'MMM YYYY').endOf('month').set('hours', 0);
  }

  return momentDate.format('YYYY-MM-DDTHH:mm:ss');
};

/**
 *
 * @param interval
 * @description This is for sending to the server on its own timezone. (UTC)
 */
export const getBalanceUTCDate = (interval: string) => {
  let momentDate = moment().utc();
  if ('Today' !== interval) {
    momentDate = moment(interval, 'MMM YYYY').endOf('month').set('hours', 0).utc();
  }

  return momentDate.format('YYYY-MM-DDTHH:mm:ss');
};
