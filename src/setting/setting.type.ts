import { Account } from 'auth/auth.types';

import { StripeSubscriptionStatus } from './setting.enum';

export interface SettingsProps {}

export enum SettingPageEnum {
  SETTINGS = 'Settings',
  PROFILE = 'Profile',
  PLAN = 'Plan',
  ACCOUNTS = 'Accounts',
}

export interface SettingTitleProps {
  pageTitle: SettingPageEnum;
  handlePageSelect: (pageName: SettingPageEnum) => void;
}

export interface SettingType {
  id: number;
  mailChimpSubscription: boolean;
  currency: string;
}

export interface EmailSubscriptionPayload {
  mailChimpSubscription: boolean;
  currency: string;
}

export interface CurrentSubscription {
  priceId: string;
  customerId: string;
  id: string | number;
  subscriptionId: string;
  cancelAt: number;
  subscriptionEnd: number;
  subscriptionStatus: StripeSubscriptionStatus;
  name: string;
}

export interface AccountCardProps {
  accountList: Account[];
  availableAccounts: string | number;
  reviewSubscriptionFlag?: boolean;
}

export interface ManualAccountProps {
  manualAccountList: Account[];
  availableAccounts: string | number;
  reviewSubscriptionFlag?: boolean;
}

export interface AccountRowProps {
  account: Account;
  reviewSubscriptionFlag?: boolean;
}

export interface AccountOverviewProps {
  reviewSubscriptionFlag?: boolean;
}

export interface SubscriptionConnectionWarningProps {
  availableConnectedAccounts: string | number;
  availableManualAccounts: string | number;
}

export interface AccountDialogBoxProps {
  availableConnectedAccounts: string | number;
  availableManualAccounts: string | number;
  manualAccountList: Account[];
  accountList: Account[];
  verifyAccountNumbers: (event: any) => void;
}

export interface Plan {
  active: boolean;
  currency: string;
  details: Record<string, any>;
  duration: string;
  name: string;
  nickname: string;
  price: number;
  priceId: string;
  save?: number;
}
