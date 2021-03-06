import { v4 } from 'uuid';
import { groupBy } from 'lodash';
import { ApiResponse } from 'api/api.types';

import { StringKeyObject } from './common.types';
import { fNumber, numberWithCommas } from './number.helper';

const toString = Object.prototype.toString;

export const shortId = v4();

export const isObject = (arg: any): boolean => {
  return toString.call(arg) === '[object Object]';
};

export const withError = (arg: any): ApiResponse => {
  if (isObject(arg)) {
    const { message = '', ...rest } = arg;

    return {
      data: null,
      error: {
        status: true,
        message,
        ...rest,
      },
    };
  }

  return {
    data: null,
    error: {
      status: true,
      message: arg,
    },
  };
};

export const withData = (data: any): ApiResponse => ({
  error: null,
  data,
});

export const serialize = (data: object): string => JSON.stringify(data);

export const parse = (data: string): StringKeyObject => {
  try {
    const parsedData = JSON.parse(data);

    return withData(parsedData);
  } catch (error) {
    return withError(error);
  }
};

export const isEmpty = (value: any) =>
  !value ||
  (typeof value === 'object' && Object.keys(value).length === 0) ||
  (typeof value === 'string' && value.trim().length === 0);

export const getReadingTime = (content: string) => {
  const wordsPerMinute = 200;

  const textLength = content.split(' ').length;
  if (textLength > 0) {
    return Math.ceil(textLength / wordsPerMinute);
  }

  return 0;
};

export const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min)) + min;
};

export const makeTypes = (type: string) => {
  return {
    [type]: type,
    [`${type}_SUCCESS`]: `${type}_SUCCESS`,
    [`${type}_FAILURE`]: `${type}_FAILURE`,
  };
};

/**
 * @description al is shortcut for Adjust Language
 * This will convert CAPITAL_LETTER to be used
 * in language file
 */
export const al = (word: string): string => {
  return word.split(' ').join('_').toUpperCase();
};

/**
 * Enumerates values of an enum.
 * Example:
 *    enum Colors { RED = 0, GREEN = 5 }
 *    enumerate(Colors) === [0, 5]
 *
 * @param {any} e
 * @returns {number[]}
 */
export function enumerate(e: any): number[] {
  return Object.keys(e).reduce((acc: any, value: string) => (isNaN(+value) ? acc : [...acc, +value]), []);
}

/**
 * Enumerates values of an enum. The assumption is that the enum is always strictly homogeneous
 * over the 'string' type.
 *
 * Example:
 *    enum Colors { RED = 'red', GREEN = 'green' }
 *    enumerate(Colors) === ['red', 'green']
 *
 * @param {any} e
 * @returns {string[]}
 */
export const enumerateStr = (e: any) => {
  return Object.keys(e).map((k) => e[k as any]);
};

export const capitalize = (word: string) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

export const arrGroupBy = <T>(arr: T[], key: string) => groupBy(arr, key);

export const handleStringArrayToggle = <A>(arr: A[], val: any) => {
  const isFound = arr.includes(val);

  if (isFound) {
    return arr.filter((item) => item !== val);
  }

  return arr.concat(val);
};

export const blobToBase64 = (blob: Blob): Promise<any> => {
  const reader = new FileReader();
  reader.readAsDataURL(blob);

  return new Promise((resolve) => {
    reader.onloadend = () => {
      resolve(reader.result);
    };
  });
};

export const ellipseText = (text: string, length: number = 20) => {
  if (text.length > length) {
    return `${text.substring(0, length)}...`;
  }

  return text;
};

export const upperCaseFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const lowerCaseAllWordsExceptFirstLetters = (str: string) => {
  return str.replace(/\S*/g, (word) => {
    return word.charAt(0) + word.slice(1).toLowerCase();
  });
};

export const formater = (val: string) => {
  let _val = '';
  if (val) {
    _val = val.replace(/_/g, ' ');
  }
  const desiredOutput = upperCaseFirstLetter(lowerCaseAllWordsExceptFirstLetters(_val));

  return desiredOutput;
};

export const getUnique = (array: string[]) => {
  const uniqueArray = [];

  for (const element of array) {
    if (uniqueArray.indexOf(element) === -1) {
      uniqueArray.push(element);
    }
  }

  return uniqueArray;
};

export const wait = (milliseconds: number) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

export const parseAmount = <T extends string | number | null>(amount: T, symbol = '$') => {
  if (amount || amount === 0) {
    return symbol + numberWithCommas(fNumber(+amount, 2));
  }

  return '--';
};
