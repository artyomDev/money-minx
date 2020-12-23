import { AllocationsFilter } from './allocation.enum';
import { Account } from 'auth/auth.types';

export interface AllocationProps { }

export interface Allocation {
  allocationValue: number;
  classificationValue: string;
  description: string;
  per: number;
}

export interface ChartDatum {
  group: string;
  per: number;
  total: number;
}

export type ChartData = ChartDatum[];

export type Allocations = Record<string, Allocation[]>;

export interface AllocationSubNavigationProps {
  onTypeChange: (type: AllocationsFilter) => void;
  filter: AllocationsFilter;
}

export interface AllocationOverviewProps {
  chartData: ChartData;
  allocations: Allocations;
  filter: AllocationsFilter;
  accountWithIssues: Account[];
}

export interface SelectedAllocationProps {
  filter: AllocationsFilter;
  currencySymbol: string;
  gotoDetailPage: (d: string) => void;
}
