export const appRouteConstants = {
  home: '/',
  auth: {
    DEF: '/auth',
    ME: '/auth/me',
    LOGIN: '/login',
    SIGNUP: '/signup',
    LOGOUT: '/logout',
    RESET_PASSWORD: '/password_reset/:token?',
    TOKEN_EXPIRED: '/token-expired',
    CONNECT_ACCOUNT: '/connect-account',
    ACCOUNT_SETTING: '/account-settings',
    FORGOT_PASSWORD: '/forgot-password',
    NET_WORTH: '/net-worth',
  },

  allocation: {
    ALLOCATION: '/allocation',
  },

  settings: {
    SETTINGS: '/settings',
  },

  networth: {
    NET_WORTH: '/net-worth',
  },

  web: {
    SECURITY: '/security',
  },

  features: {
    FEATURES_CRYPTOS: '/features/cryptos',
    FEATURES_NET_WORTH: '/features/net-worth',
    FEATURES_ALLOCATIONS: '/features/allocations',
    FEATURES_MULTICURRENCY: '/features/multicurrency',
    FEATURES_SYNCED_MANUAL: '/features/synced-and-manual',
    FEATURES_TRANSACTION_HISTORY: '/features/transaction-history',
  },

  misc: {
    NOT_FOUND: '/404',
    STRIPE_SUCCESS: '/stripe/success',
    STRIPE_FAILURE: '/stripe/cancel',
  },

  account: {
    ACCOUNT: '/account-details/:accountId',
  },

  subscription: {
    SUBSCRIPTION: '/subscription',
    REVIEW: '/subscription/review',
  },
};
