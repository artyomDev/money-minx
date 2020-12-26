import { makeTypes } from 'common/common-helper';

export const auth = {
  ...makeTypes('LOGIN'),
  ...makeTypes('REGISTER'),
  ...makeTypes('SIGN_OUT'),
  ...makeTypes('PROFILE_COMPLETE'),
  ...makeTypes('FETCH_ACCOUNT'),
  ...makeTypes('FETCH_PROFILE'),
  ...makeTypes('UPDATE_EMAIL_ADDRESS'),
};

export const subscription = {
  SET_SUBSCRIPTION_DETAIL: 'SET_SUBSCRIPTION_DETAIL',
  SET_CURRENT_SUBSCRIPTION: 'SET_CURRENT_SUBSCRIPTION',
};
