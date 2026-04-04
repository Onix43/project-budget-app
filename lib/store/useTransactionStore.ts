import { Transaction } from "@/types/transaction";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TransactionStore {
  transaction: Transaction;
  setTransaction: (newTransaction: Transaction) => void;
  clearTransaction: () => void;
}

const initialTransaction: Transaction = {
  type: "expenses",
  date: "",
  time: "",
  category: "",
  sum: 0,
  comment: "",
};

export const useTransactionStore = create<TransactionStore>()(
  persist(
    (setStore) => ({
      transaction: initialTransaction,
      setTransaction: (newTransaction: Transaction) =>
        setStore({ transaction: newTransaction }),
      clearTransaction: () => setStore({ transaction: initialTransaction }),
    }),
    {
      name: "transaction-storage",
      partialize: (state) => ({ transaction: state.transaction }),
    },
  ),
);
