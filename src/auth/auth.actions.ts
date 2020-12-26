import { auth, subscription } from './auth-context.types';
import { Account, ICurrentSubscription, ILoginResponse, SubscriptionDetail } from './auth.types';

export const setSubscriptionDetail = (subscriptionDetail?: SubscriptionDetail) => {
  return {
    type: subscription.SET_SUBSCRIPTION_DETAIL,
    payload: {
      subscriptionDetail,
    },
  };
};

export const setCurSubscription = (currentSubscription: ICurrentSubscription) => {
  return {
    type: subscription.SET_CURRENT_SUBSCRIPTION,
    payload: {
      currentSubscription,
    },
  };
};

export const setLoginSuccess = (payload: ILoginResponse) => {
  return {
    type: auth.LOGIN_SUCCESS,
    payload,
  };
};

/**
 * @param data
 * @description we will filter out to have fresh accounts by whether the account is being overridden or not.
 */
export const setFreshAccounts = (data: Account[]) => {
  const freshAccounts = data?.filter((acc) => !acc.accountDetails.overridden);

  return {
    type: auth.FETCH_ACCOUNT_SUCCESS,
    payload: { user: freshAccounts },
  };
};

/**
 * @param data
 * @description This method will set all the achieved accounts since we might need to modify the content
 * of existing accounts
 */
export const setAccountSuccess = (data: Account[]) => {
  return {
    type: auth.FETCH_ACCOUNT_SUCCESS,
    payload: { user: data },
  };
};
