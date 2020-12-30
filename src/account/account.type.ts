import { ModalType } from 'common/components/modal';
import { Account } from 'auth/auth.types';

export interface AccountSubNavigationProps {
  AccountDetails: Account;
  baseCurrency: boolean;
  toggleBaseCurrency: () => void;
}

export interface AccountChartItem {
  interval: string;
  type: string;
  value: number;
}

export interface AccountBarGraphProps {
  data: AccountChartItem[];
  curInterval: string;
  currencySymbol: string;
  mmCategory: string;
}

export interface AccountHoldingItem {
  accountId: number;
  accruedIncome: any;
  accruedIncomeCurrency: string;
  accruedInterest: any;
  accruedInterestCurrency: string;
  contractQuantity: any;
  costBasis: number;
  costBasisCurrency: string;
  couponRate: any;
  createdDate: string;
  cusipNumber: any;
  description: string;
  exercisedQuantity: any;
  expirationDate: any;
  grantDate: any;
  holdingType: string;
  id: number;
  interestRate: any;
  intervalValues: AccountChartItem[];
  isManual: boolean;
  isShort: boolean;
  isin: any;
  lastUpdated: string;
  matchStatus: string;
  maturityDate: any;
  optionType: string;
  price: number;
  priceCurrency: string;
  providerAccountId: number;
  quantity: number;
  securityType: string;
  sedol: any;
  spread: any;
  spreadCurrency: string;
  strikePrice: any;
  strikePriceCurrency: string;
  symbol: string;
  term: any;
  unvestedQuantity: any;
  unvestedValue: any;
  unvestedValueCurrency: string;
  vestedDate: any;
  vestedQuantity: any;
  vestedSharesExercisable: any;
  vestedValue: any;
  vestedValueCurrency: string;
  yodleeId: number;
}

export interface AccountHolingsProps {
  charts: AccountChartItem[];
  holdings: AccountHoldingItem[];
}

export interface HoldingsDetailsModalProps {
  holdingsDetailsModal: ModalType;
  holdingsDetails?: any;
  accountId?: number;
  closeNewPositionModal?: () => void;
  closeEditPositionModal?: () => void;
  currencySymbol: string;
}

export interface DisabledInputProps {
  currencySymbol: string;
}

export interface AccountHolingsTableProps {
  holdingsData: AccountHoldingItem[];
  openEditPositionModalFun: () => void;
  closeEditPositionModalFun: () => void;
  currencySymbol: string;
  accountDetails?: Account;
}

export interface AccountTransactionItem {
  accountId: number;
  quantity: number;
  price: number;
  amount: number;
  amountCurrency: string;
  balance: any;
  balanceCurrency: string;
  baseType: string;
  cashFlow: boolean;
  date: string;
  description: string;
  id: number;
  income: boolean;
  isIgnored: boolean;
  isManual: boolean;
  type: string;
  yodleeId: number;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityDetailsModalProps {
  activityDetailsModal: ModalType;
  activityDetails?: AccountTransactionItem;
  accountId?: number;
  currencySymbol: string;
  closeNewActivityModal?: () => void;
  closeEditActivityModal?: () => void;
}

export interface AccountTransactionTableProps {
  transactionsData: AccountTransactionItem[];
  openEditActivityModalFun: () => void;
  closeEditActivityModalFun: () => void;
  currencySymbol: string;
}

export interface AccountTransactionsProps {
  charts: AccountChartItem[];
  transactions: AccountTransactionItem[];
}

export type ClassificationType = 'Asset Class' | 'Country' | 'Risk' | 'Type';

export interface ClassificationItem {
  accountId: number;
  allocation: number;
  classificationType: ClassificationType;
  classificationValue: string;
  createdAt: string;
  id: number;
  positionId: number;
  updatedAt: string;
  yodleeId: number;
}

export interface Classifications {
  Asset_Class: ClassificationItem[];
  Country: ClassificationItem[];
  Risk: ClassificationItem[];
  Type: ClassificationItem[];
}
