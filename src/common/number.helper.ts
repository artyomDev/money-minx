export const isNumber = (x: any): x is number => typeof x === 'number';

export const isString = (x: any): x is string => typeof x === 'string';

export const fNumber = (num: number | string, digits: any | 2) => {
  if (isString(num)) {
    return Number.parseFloat(num).toFixed(digits);
  }
  if (num) {
    return num.toFixed(digits);
  }

  return '0';
};

export const numberWithCommas = (num: number | string) => {
  const parsedNum = Number(num).toFixed(2);

  return parsedNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
