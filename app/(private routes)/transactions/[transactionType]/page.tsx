"use client";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/lib/api/clientUserApi";
import { getCategoriesStats } from "@/lib/api/clientCategoryApi";
import TransactionsTitle from "@/components/TransactionsTitle/TransactionsTitle";
import TransactionsTotalAmount from "@/components/TransactionsTotalAmount/TransactionsTotalAmount";
import TransactionsChart from "@/components/TransactionsChart/TransactionsChart";
import styles from "./page.module.css";

export default function MainTransactionsPage() {
  const { data: user } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });
  const { data: stats = [], isLoading } = useQuery({
    queryKey: ["categoriesStats"],
    queryFn: getCategoriesStats,
  });

  const incomes = user?.transactionsTotal?.incomes ?? 0;
  const expenses = user?.transactionsTotal?.expenses ?? 0;
  return (
    <div className="container">
      <main className={styles.page}>
        <div className={styles.left}>
          <TransactionsTitle />
          <TransactionsTotalAmount incomes={incomes} expenses={expenses} />
        </div>
        <div className={styles.right}>
          <TransactionForm
            initialType={params.transactionType as "income" | "expense"}
          />
        </div>
        <div className={styles.chart}>
          <TransactionsChart rawStats={stats} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
}
