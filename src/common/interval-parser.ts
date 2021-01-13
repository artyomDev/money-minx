import { AccountItem } from 'networth/networth.type';
import { AccountCategory } from 'networth/networth.enum';
import { getMonthYear, getQuarter, getYear } from 'common/moment.helper';

import { parseString } from './moment.helper';

export const parseInterval = (obj: Record<string, any>, isQuarter: boolean = false): Record<string, any> => {
  return {
    ...obj,
    interval: obj.interval === 'Today' ? obj.interval : parseString(obj.interval, isQuarter),
  };
};

export const parseIntervalList = (list: Record<string, any>[], isQuarter: boolean = false) =>
  list.map((item) => parseInterval(item, isQuarter));

export const parseAccountDetails = (accDetails: Record<AccountCategory, AccountItem[]>, isQuarter: boolean = false) => {
  return Object.keys(accDetails).reduce<Record<string, any>>((acc, cur: any) => {
    const key = cur as AccountCategory;

    acc[key] = accDetails[key]?.map((curAccount: AccountItem) => {
      return {
        ...curAccount,
        balances: parseIntervalList(curAccount.balances, isQuarter),
      };
    });

    return acc;
  }, {});
};

export const isCurrent = (interval: string) =>
  interval === 'Today' || getMonthYear() === interval || getYear() === interval || getQuarter() === interval;

export const gc = (interval: string) => (interval === 'Today' ? 'current-m' : '');

export const parseIntervalText = (txt: string) => {
  if (txt === 'Today') {
    return txt;
  }

  const [month, year] = txt.split(' ');

  return `${month} ${year?.slice(2)}`;
};
