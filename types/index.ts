export type Spreadsheet = {
  id: string;
  name: string;
};

export type Category = {
  id: string;
  name: string;
  available: number;
  activity: number;
  budgeted: number;
  budgetedTotal: number;
  isGroup: boolean;
  isCreditCard: boolean;
};

export type Balance = {
  id: string;
  name: string;
  amount: string;
  lastUpdateOn: string;
};

export type Transaction = {
  date: Date;
  inflow: boolean;
  amount: number;
  category: string;
  account: string;
  memo: string;
};

export type Stats = {
  toBudget?: string;
  spent?: string;
  budgeted?: string;
  pending?: string;
};
