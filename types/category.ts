export type CategoryType = "incomes" | "expenses";

export interface Category {
  _id: string;
  categoryName: string;
  type: CategoryType;
}

export interface CategoryStats {
  _id: string;
  totalAmount: number;
  category: string;
}
