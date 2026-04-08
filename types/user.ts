import { Category } from "./category";

export interface RegisterUser {
  _id: string;
  email: string;
  name: string;
}

interface UserCategories {
  incomes: Category[];
  expenses: Category[];
}

interface UserTransactionsTotal {
  incomes: number;
  expenses: number;
}

export interface User {
  _id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  currency: string;
  categories: UserCategories;
  transactionsTotal: UserTransactionsTotal;
}

export interface UserProfile {
  name: string;
  currency: string;
  avatarUrl?: string | null;
}

export interface UpdateUserProfile {
  _id: string;
  name: string;
  currency: string;
}
