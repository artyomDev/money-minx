import moment from 'moment';

/**
 *
 * @param inputDate
 * used just for parsing not calculation please
 * @if the date is in invalid format then it might cause problem with parsing
 */
export const getMonthYear = (inputDate?: any) => {
  if (inputDate && hasInterval(inputDate)) {
    if (inputDate.toString().includes('Q')) {
      return moment(inputDate, 'Q YYYY').format('MMM YYYY');
    }

    return moment(inputDate, 'MMM YYYY').format('MMM YYYY');
  }

  return moment(inputDate).format('MMM YYYY');
};

export const hasInterval = (input: any) => {
  if (2 === input.toString().split(' ').length) {
    return true;
  }

  return false;
};

export const parseDateFromString = (dateString: string) => {
  if (dateString === 'Today') {
    return moment().toDate();
  }

  if (dateString.toString().includes('Q')) {
    const qDate = moment(dateString, 'Q YYYY').toDate();

    return qDate;
  }

  const myDate = moment(dateString, 'MMM YYYY').toDate();

  return myDate;
};

export const parseUTCString = (str: string, isQuarter?: boolean) => {
  if (isQuarter) {
    return moment.utc(str, 'Q YYYY').local().format('[Q]Q YYYY');
  }

  return moment.utc(str, 'MMM YYYY').local().format('MMM YYYY');
};

export const parseString = (str: string, isQuarter?: boolean) => {
  if (isQuarter) {
    return moment(str, 'Q YYYY').format('[Q]Q YYYY');
  }

  return moment(str, 'MMM YYYY').format('MMM YYYY');
};

export const parseDate = (str: string) => {
  if (str.includes('Q')) {
    return moment.utc(str, 'Q YYYY').toDate();
  }

  return moment.utc(str, 'MMM YYYY').toDate();
};

export const getDateString = <T>(inputDate?: T) => moment(inputDate).format();

export const getDateFormattedString = <T>(inputDate?: T) => moment(inputDate).format('MM/DD/YYYY');

export const getUTC = <T>(inputDate?: T) => moment.utc(inputDate).toDate();

export const getRelativeDate = (inputDate: string) => {
  const rDate = moment.utc(inputDate).fromNow();

  return rDate;
};

export const getISOString = <T>(inputDate: T) => moment(inputDate).toISOString();

export const isAfter = <T, D>(inputDate: T, valDate?: D) => moment.utc(inputDate).isAfter(valDate);

export const isBefore = <T, D>(inputDate: T, valDate?: D) => moment.utc(inputDate).isBefore(valDate);

export const getDate = <T>(inputDate: T) => new Date(moment.utc(inputDate).format('yyyy-MM-DD')).toISOString();

export const getQuarter = <T>(inputDate?: T) => {
  const qDate = moment.utc(inputDate).format('[Q]Q yyyy');
  return qDate;
};

export const getYear = <T>(inputDate?: T) => moment.utc(inputDate).format('yyyy');

export const getStringDate = <T>(inputDate?: T) => moment(inputDate).format('MMM DD, yyyy');

/**
 * @param inputDate
 * @description get previous month on current timezone
 */
export const getPreviousMonth = <T extends Date | null>(inputDate?: T) => {
  if (inputDate) {
    return moment(inputDate).subtract(1, 'month').toDate();
  }

  return moment().subtract(1, 'month').toDate();
};

/**
 * @param inputDate
 * @description get next month on current timezone
 */
export const getNextMonth = <T extends Date | null>(inputDate?: T) => {
  if (inputDate) {
    return moment(inputDate).add(1, 'month').toDate();
  }

  return moment().subtract(1, 'month').toDate();
};

export const getMonthSubtracted = (month: number) => moment.utc().subtract(month, 'month').toDate();

/**
 * @param date
 * @description get the last date of the month in current timezone
 */
export const getLastDateOfMonth = (date: Date) => moment(date).endOf('month').toDate();

export const getUTCString = (date?: Date) => moment.utc(date).toISOString();

export const getMomentDate = (str?: string) => moment(str).toDate();

export const getPreviousYearFirstDate = (year: number) =>
  moment.utc().subtract(year, 'year').startOf('year').toISOString();

export const dateToString = (date: Date) => moment.utc(date).format('YYYY-MM-DDTHH:mm:ss');

export const getFullMonth = (date: string) => (isToday(date) ? 'Today' : moment(date).format('MMMM'));

export const isFuture = (date: string) => moment(date).isAfter();

export const isToday = (date: string | Date) =>
  moment(date).format('YYYY-MM-DD') === moment(new Date()).format('YYYY-MM-DD');
