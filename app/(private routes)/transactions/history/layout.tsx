"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/lib/api/clientUserApi";
import TransactionsTotalAmount from "@/components/TransactionsTotalAmount/TransactionsTotalAmount";
import TransactionsSearchTools from "@/components/TransactionsSearchTools/TransactionsSearchTools";
import css from "./TransactionsHistory.module.css";

interface HistoryLayoutProps {
  list: React.ReactNode;
}

export default function HistoryLayout({ list }: HistoryLayoutProps) {
  const pathname = usePathname();
  const isIncomes = pathname.endsWith("/incomes");
  const title = isIncomes ? "All Income" : "All Expense";

  const { data: user } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });

  const incomes = user?.transactionsTotal?.incomes ?? 0;
  const expenses = user?.transactionsTotal?.expenses ?? 0;

  return (
    <main className={css.page}>
      <div className={css.header}>
        <h1 className={css.title}>{title}</h1>
        <p className={css.description}>
          View and manage every transaction seamlessly! Your entire financial
          landscape, all in one place.
        </p>
      </div>
      <TransactionsTotalAmount incomes={incomes} expenses={expenses} />
      <div className={css.content}>
        <Suspense>
          <TransactionsSearchTools />
        </Suspense>
        <Suspense>
          {list}
        </Suspense>
      </div>
    </main>
  );
}
