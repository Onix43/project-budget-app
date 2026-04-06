"use client";

import TransactionsSearchTools from "@/components/TransactionsSearchTools/TransactionsSearchTools";
import TransactionsList from "@/components/TransactionsList/TransactionsList";
import css from "./TransactionsHistory.module.css";

export default function TransactionsHistoryPage() {
  return (
    <main className={css.page}>
      <div className={css.header}>
        <h1 className={css.title}>All Expense</h1>
        <p className={css.description}>
          View and manage every transaction seamlessly! Your entire financial
          landscape, all in one place.
        </p>
      </div>
      <div className={css.content}>
        <TransactionsSearchTools />
        <TransactionsList />
      </div>
    </main>
  );
}
