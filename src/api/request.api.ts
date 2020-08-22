import * as http from './http.api';

import { urls } from './api.url';
import { RegisterPayload } from 'auth/auth.types';
import { ApiResponse } from 'app/app.types';

export const postLogin = (payload: { email: string; password: string }) => {
  return http.post(urls.auth.LOGIN_IN, payload);
};

export const postFacebookLogin = (payload: {
  accessToken: string;
  mailChimpSubscription: boolean;
  subscriptionPriceId: string;
}): Promise<ApiResponse> => {
  return http.post(`${urls.auth.FACEBOOK_LOGIN}?access_token=${payload.accessToken}`, {
    subscriptionPriceId: payload.subscriptionPriceId,
    mailChimpSubscription: payload.mailChimpSubscription,
  });
};

export const postRegister = (payload: RegisterPayload) => {
  return http.post(urls.auth.REGISTER, payload);
};

export const postFacebookAssociation = (token: string) => {
  return http.post(urls.auth.ASSOCIATE_LOGIN, {}, false, { access_token: token });
};

export const postForgotPassword = (email: string): Promise<ApiResponse> => {
  return http.post(urls.auth.FORGOT_PASSWORD, { email }, false);
};

export const getSubscription = () => {
  return http.get(urls.subscription.SUB);
};

export const getFastlink = () => {
  return http.get(urls.yodlee.FAST_LINK);
};

export const getRefreshedAccount = () => {
  return http.get(urls.auth.PROFILE_REFRESH);
};

export const refreshAccessToken = ({ referenceToken }: { referenceToken: string }): Promise<any> => {
  return Promise.resolve({ referenceToken });
};
