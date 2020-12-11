export const formatter = (value: number, currencySymbol: string) => {
  if (value < 1000000) {
    return `$${value / 1000}k${currencySymbol}`;
  }

  return `$${value / 1000000}m${currencySymbol}`;
};

export const getInterval = (max: number) => {
  const _interval = max / 4;
  const _l = Number(_interval.toString().split('.')[0].length) - 1;
  const _maxFloor = Math.ceil(_interval / Math.pow(10, _l));

  return _maxFloor * Math.pow(10, _l);
};
