import { CategoryType } from "./category";

export interface Transaction {
  type: CategoryType;
  date: string;
  time: string;
  category: string;
  sum: number;
  comment?: string;
}

export interface TransactionUpdateData {
  date: string;
  time: string;
  category: string;
  sum: number;
  comment?: string;
}

export type TransactionWithId = Transaction & {
  _id: string;
};
