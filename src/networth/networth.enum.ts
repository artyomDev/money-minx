export enum AccountCategory {
  LIABILITIES = 'Liabilities',
  OTHER_ASSETS = 'Other Assets',
  INVESTMENT_ASSETS = 'Investment Assets',
}

export enum TimeIntervalEnum {
  YEARLY = 'Yearly',
  MONTHLY = 'Monthly',
  QUARTERLY = 'Quarterly',
}

export enum NetworthActionEnum {
  SET_F_ACCOUNT = 'SET_FILTER_ACCOUNT',
  SET_F_CATEGORY = 'SET_FILTER_CATEGORY',
  SET_F_FROM_DATE = 'SET_FILTER_FROM_DATE',
  SET_F_ACCOUNT_TYPE = 'SET_FILTER_ACCOUNT_TYPE',
  SET_F_TIME_INTERVAL = 'SET_FILTER_TIME_INTERVAL',

  SET_NETWORTH = 'SET_NETWORTH',
  SET_ACCOUNTS = 'SET_ACCOUNTS',
}
