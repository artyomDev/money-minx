import { ModalType } from "common/components/modal";

export interface AccountSubNavigationProps {
  providerLogo: string;
  providerName: string;
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
  currency?: string;
  closeNewPositionModal?: () => void;
  closeEditPositionModal?: () => void;
}

export interface AccountHolingsTableProps {
  holdingsData: AccountHoldingItem[];
  openEditPositionModalFun: () => void;
  closeEditPositionModalFun: () => void;
  currencySymbol: string;
}

export interface AccountTransactionItem {
  accountId: number;
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
}

export interface AccountTransactionTableProps {
  transactionsData: AccountTransactionItem[];
  currencySymbol: string;
}

export interface AccountTransactionsProps {
  charts: AccountChartItem[];
  transactions: AccountTransactionItem[];
}
