import { FormikProps } from 'formik';
import { StringKeyObject } from 'common/common.types';
import { StripeSubscriptionStatus } from 'setting/setting.enum';

import { AuthState, ProviderAccountStatus, ProviderAggregationSource, RoleEnum } from './auth.enum';

export type Dispatch = (args: StringKeyObject) => void;

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ILoginResponse {
  expires: number;
  token: string;
  onboarded: boolean;
}

export interface RegisterPayload {
  email: string;
  password: string;
  subscriptionPriceId: string;
  mailChimpSubscription: boolean;
}

export interface ResetPasswordPayload {
  password: string;
  token: string;
}

export interface VerifyResetPasswordTokenPayload {
  token: string;
}

export interface UserType {
  [key: string]: any;
}

export interface ProviderAccount {
  aggregationSource: ProviderAggregationSource;
  createdAt: string | Date;
  createdDate: string | Date;
  dataset: any[];
  id: number;
  isManual: boolean;
  profileId: number;
  providerAccountId: number;
  providerId: number;
  requestId: string;
  status: ProviderAccountStatus;
  updatedAt: string | Date;
}

export interface Account {
  id: number;
  yodleeId: number;
  accountName: string;
  accountNumber: string;
  providerName: string;
  providerLogo: string;
  profileId: number;
  category: any;
  accountDetails: any;
  isManual: boolean;
  balance: number;
  balancesFetchedAt: string;
  currency: string;
  providerAccount: ProviderAccount;
  syncError: boolean;
}

export interface ProfileDetails {
  dependants: number;
  dob: string | Date;
  minxWinks: boolean;
  id: number | string;
  maritalStatus: string;
  riskTolerance: string;
  minxMeasureUp: boolean;
  alreadyRetired: boolean;
  householdIncome: string;
  profileEnabled: boolean;
  spouseDob: string | Date;
  shareAssetValues: boolean;
  countryOfResidence: string;
  shareAssetAllocation: boolean;
  spouseAlreadyRetired: boolean;
  targetedRetirementAge: number;
  spouseTargetedRetirementAge: number;
}

export interface ProfileType {
  roles: any;
  bio: string;
  role: string;
  uuid: string;
  email: string;
  picture: string;
  website: string;
  lastName: string;
  username: string;
  firstName: string;
  id: string | number;
  investingSince: number;
  profileEnabled: boolean;
  profileDetails: ProfileDetails;
}

export interface Subscription {
  cancelAt: Date | null;
  customerId: string;
  id: number;
  name: string;
  priceId: string;
  subscriptionEnd: number | string;
  subscriptionId: string;
  subscriptionStatus: string;
}

export interface SubscriptionDetail {
  active: boolean;
  currency: string;
  details: Record<string, string>;
  duration: string;
  name: string;
  nickname: string;
  price: number;
  priceId: string;
}

export interface ICurrentSubscription {
  cancelAt: string | null;
  createdAt: string;
  customerId: string;
  id: number;
  name: string;
  priceId: string;
  subscriptionEnd: number;
  subscriptionId: string;
  subscriptionStatus: StripeSubscriptionStatus;
  updatedAt: string | null;
}

export interface AuthType {
  email: string;
  token?: string;
  expires?: number;
  onboarded?: boolean;
  user?: ProfileType;
  roles?: RoleEnum[];
  authState: AuthState;
  isSigningIn: boolean;
  accounts: Account[];
  isAuthenticated: boolean;
  currentSubscription?: ICurrentSubscription;
  subscriptionDetail?: SubscriptionDetail;
}

export interface LoginFormProps {
  props: FormikProps<LoginPayload>;
}

export interface RegisterFormProps {
  props: FormikProps<RegisterPayload>;
}

export interface LoginServicePayload {
  dispatch: Dispatch;
  payload: LoginPayload;
}

export interface FBAssociationPayload {
  dispatch: Dispatch;
  token: string;
}
export interface RegisterServicePayload {
  dispatch: Dispatch;
  payload: RegisterPayload;
}

export interface ChangePasswordServicePayload {
  dispatch: Dispatch;
  payload: {
    newPassword: string;
    oldPassword: string;
  };
}

export interface DeleteAccountPayload {
  dispatch: Dispatch;
  accounts: Account[];
}

export interface Mortgage {
  id: number | string;
  accountName: string;
  balance: number;
  principalBalance: number;
}

export type MortgageList = Mortgage[];

export interface LoanAccount {
  accountName: string;
  balance: number;
  id: number;
}

export type loanAccounts = LoanAccount[];

export interface IRealEstateAccount {
  id: number | string;
  balance: number | string;
  accountName: string;
}
