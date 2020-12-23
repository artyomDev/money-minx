import { ApiResponse } from 'app/app.types';
import { EmailSubscriptionPayload } from 'setting/setting.type';
import { RegisterPayload, ResetPasswordPayload, VerifyResetPasswordTokenPayload } from 'auth/auth.types';

import { urls } from './api.url';
import * as http from './http.api';

type TApiResponse = Promise<ApiResponse>;

export const postLogin = (payload: { email: string; password: string }): TApiResponse => {
  return http.post(urls.auth.LOGIN_IN, payload);
};

export const postFacebookLogin = (payload: {
  accessToken: string;
  mailChimpSubscription: boolean;
  subscriptionPriceId: string;
}): TApiResponse => {
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

export const postForgotPassword = (email: string): TApiResponse => {
  return http.post(urls.auth.FORGOT_PASSWORD, { email }, false);
};

export const postResetPassword = (payload: ResetPasswordPayload): TApiResponse => {
  return http.post(urls.auth.RESET_PASSWORD, payload, false);
};

export const checkResetPasswordToken = (payload: VerifyResetPasswordTokenPayload): TApiResponse => {
  return http.post(urls.auth.VERIFY_RESET_PASSWORD_TOKEN, payload, false);
};

export const patchChangePassword = <T>(payload: T): TApiResponse => {
  return http.patch(urls.auth.UPDATE_PASSWORD, payload);
};

export const getSubscription = <P>(params?: P) => {
  return http.get(urls.subscription.SUB, params);
};

export const postSubscriptionCheckout = <T>(payload: T): TApiResponse => {
  return http.post(urls.subscription.STRIPE_CHECKOUT, payload);
};

export const getCurrentSubscription = () => {
  return http.get(urls.subscription.CURRENT_SUB);
};

export const patchCancelSubscription = (): TApiResponse => {
  return http.patch(urls.subscription.CANCEL, {});
};

export const getFastlink = () => {
  return http.get(urls.yodlee.FAST_LINK);
};

export const getFastlinkUpdate = (accountId: number) => {
  return http.get(urls.yodlee.FAST_LINK_UPDATE.replace(':accountId', accountId.toString()));
};

export const getAccountRefresh = () => {
  return http.get(urls.auth.ACCOUNT_REFRESH);
};

export const getConnectionInfo = () => {
  return http.get(urls.auth.ACCOUNT_CONNECTION_INFO);
};

export const getAccountsCount = () => {
  return http.get(urls.auth.ACCOUNTS_COUNT);
};

export const getAccount = (): TApiResponse => {
  return http.get(urls.auth.ACCOUNTS);
};

export const getAccountWithProvider = (): TApiResponse => {
  return http.get(urls.auth.ACCOUNTS_WITH_PROVIDER);
};

export const getProfile = () => {
  return http.get(urls.auth.PROFILE);
};

export const getAccountCategory = (): TApiResponse => {
  return http.get(urls.auth.ACCOUNT_CATEGORY);
};

export const getAccountType = (): TApiResponse => {
  return http.get(urls.auth.ACCOUNT_TYPE);
};

export const getManualAccountType = (): TApiResponse => {
  return http.get(urls.auth.MANUAL_ACCOUNT_TYPE);
};

export const postManualAccount = <T>(payload: T): TApiResponse => {
  return http.post(urls.auth.MANUAL_ACCOUNT, payload);
};

export const getAccountSubType = (accountType: string): TApiResponse => {
  return http.get(urls.auth.ACCOUNT_SUBTYPE.replace(':accountType', accountType));
};

export const getAssociateMortgage = (): TApiResponse => {
  return http.get(urls.auth.ASSOCIATE_MORTGAGE);
};

export const getLoanAccounts = (): TApiResponse => {
  return http.get(urls.auth.LOAN_ACCOUNT);
};

export const getFormFieldFilter = (accountType: string, accountSubtype: string): TApiResponse => {
  return http.get(
    urls.auth.FORM_FIELD_FILTER.replace(':accountType', accountType).replace(':accountSubType', accountSubtype)
  );
};

export const refreshAccessToken = ({ referenceToken }: { referenceToken: string }): Promise<any> => {
  return Promise.resolve({ referenceToken });
};

export const getCurrentSettings = () => {
  return http.get(urls.auth.SETTINGS);
};

export const patchEmailSubscription = (payload: EmailSubscriptionPayload): TApiResponse => {
  return http.patch(urls.auth.SETTINGS, payload);
};

export const patchProfilePicture = (payload: any): TApiResponse => {
  return http.patch(urls.auth.PROFILE_PICTURE, payload);
};

export const patchProfile = <T>(payload: T): TApiResponse => {
  return http.patch(urls.auth.PATCH_PROFILE, payload);
};

export const patchAccount = (id: string, data: any) => {
  return http.patch(urls.auth.PATCH_ACCOUNT.replace(':id', id), data);
};

export const getAccountDetails = (id: string, baseCurrency: boolean) => {
  return http.get(urls.auth.ACCOUNT_DETAILS.replace(':id', id).replace(':baseCurrency', baseCurrency.toString()));
};

export const getAccountHoldings = <P>(params?: P) => {
  return http.get(urls.auth.ACCOUNT_HOLDINGS, params);
};

export const getAccountActivity = <P>(params?: P) => {
  return http.get(urls.auth.ACCOUNT_ACTIVITY, params);
};

export const getHoldingsDetails = (id: string) => {
  return http.get(urls.auth.HOLDINGS_DETAILS.replace(':positionId', id));
};

export const getActivityDetails = (id: string) => {
  return http.get(urls.auth.ACTIVITY_DETAILS.replace(':activityId', id));
};

export const getClassification = (filter: string) => {
  return http.get(urls.auth.CLASSIFICATION.replace(':filter', filter));
};

export const getHoldingsAccountsByDescription = (description: string) => {
  return http.get(urls.auth.HOLDINGS_ACCOUNTS_BY_DESCRIPTION.replace(':description', description));
};

export const getHoldingTypes = () => {
  return http.get(urls.allocations.HOLDING_TYPES);
};

export const getActivityTypes = () => {
  return http.get(urls.auth.ACTIVITY_TYPES);
};

export const patchPosition = (id: string, data: any) => {
  return http.patch(urls.auth.HOLDINGS_DETAILS.replace(':positionId', id), data);
};

export const postPosition = <T>(payload: T): TApiResponse => {
  return http.post(urls.auth.HOLDINGS_DETAILS.replace('/:positionId', ''), payload);
};

export const patchTransaction = (id: string, data: any) => {
  return http.patch(urls.auth.ACTIVITY_DETAILS.replace(':activityId', id), data);
};

export const postTransaction = <T>(payload: T): TApiResponse => {
  return http.post(urls.auth.ACTIVITY_DETAILS.replace('/:activityId', ''), payload);
};

export const deleteAccount = (id: string): TApiResponse => {
  return http.remove(urls.auth.PATCH_ACCOUNT.replace(':id', id));
};

export const getNetworth = <P>(params?: P) => {
  return http.get(urls.networth.NETWORTH, params);
};

export const getAllocations = <P>(params?: P): TApiResponse => {
  return http.get(urls.allocations.ALLOCATIONS, params);
};

export const getAllocationChartSetting = (): TApiResponse => {
  return http.get(urls.allocations.CHART_SETTINGS);
};

export const patchAllocationChartSettings = <D>(data: D): TApiResponse => {
  return http.patch(urls.allocations.CHART_SETTINGS, data);
};

export const postUploadChart = <D>(data: D): TApiResponse => {
  return http.post(urls.allocations.UPLOAD_CHART, data);
};

export const patchCompleteProfile = (): TApiResponse => {
  return http.patch(urls.auth.COMPLETE_PROFILE);
};

export const getNewAccounts = (): TApiResponse => {
  return http.get(urls.auth.NEW_ACCOUNTS);
};

export const getLatestProviderAccounts = (): TApiResponse => {
  return http.get(urls.auth.LATEST_PROVIDER_ACCOUNTS);
};
