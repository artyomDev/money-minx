import { groupBalanceByYear } from 'account/account.helper';

describe('Account helper test', () => {
  test.only('Group balance by year', () => {
    const data = [
      { balance: null, date: '2019-01-01T00:00:00' },
      { balance: null, date: '2019-02-01T00:00:00' },

      { balance: null, date: '2019-03-01T00:00:00' },

      { balance: null, date: '2019-04-01T00:00:00' },

      { balance: null, date: '2019-05-01T00:00:00' },

      { balance: null, date: '2019-06-01T00:00:00' },

      { balance: null, date: '2019-07-01T00:00:00' },

      { balance: null, date: '2019-08-01T00:00:00' },

      { balance: null, date: '2019-09-01T00:00:00' },

      { balance: null, date: '2019-10-01T00:00:00' },

      { balance: null, date: '2019-11-01T00:00:00' },

      { balance: null, date: '2019-12-01T00:00:00' },

      { balance: null, date: '2020-01-01T00:00:00' },

      { balance: null, date: '2020-02-01T00:00:00' },

      { balance: null, date: '2020-03-01T00:00:00' },

      { balance: null, date: '2020-04-01T00:00:00' },

      { balance: null, date: '2020-05-01T00:00:00' },

      { balance: null, date: '2020-06-01T00:00:00' },

      { balance: null, date: '2020-07-01T00:00:00' },

      { balance: null, date: '2020-08-01T00:00:00' },

      { balance: null, date: '2020-09-01T00:00:00' },

      { balance: null, date: '2020-10-01T00:00:00' },
    ];

    const result = groupBalanceByYear(data);

    console.log(result);
  });
});
