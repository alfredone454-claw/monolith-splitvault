// Types for SplitVault

export interface Group {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  totalExpenses: number;
  createdAt: number;
}

export interface Expense {
  id: string;
  groupId: string;
  description: string;
  amount: number;
  paidBy: string;
  splitAmong: string[];
  createdAt: number;
}

export type RootStackParamList = {
  Home: undefined;
  GroupDetail: { groupId: string };
  AddExpense: { groupId?: string };
};
