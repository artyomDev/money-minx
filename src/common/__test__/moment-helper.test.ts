import { getPreviousYearFirstDate, getStringDate, parseDate } from 'common/moment.helper';
import moment from 'moment';

describe('Moment helper', () => {
  test('Get Full string date', () => {
    const expected = 'Sep 28, 2020';
    const today = new Date('2020-09-28');

    expect(getStringDate(today)).toBe(expected);
  });

  test('Parse Date', () => {
    const val = 'Aug 2020';
    expect(parseDate(val)).toStrictEqual(moment.utc('2020-08-01T00:00:00.000Z').toDate());
  });

  test.only('Get previous year first date', () => {
    const dateOneYearBefore = getPreviousYearFirstDate(1);
    const dateTwoYearBefore = getPreviousYearFirstDate(2);

    expect(dateOneYearBefore).toBe('2020-01-01T00:00:00.000Z');
    expect(dateTwoYearBefore).toBe('2019-01-01T00:00:00.000Z');
  });
});
