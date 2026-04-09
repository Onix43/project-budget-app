"use client";
import { useQuery } from "@tanstack/react-query";
import { getCategoriesStats } from "@/lib/api/clientCategoryApi";
import TransactionsTitle from "@/components/TransactionsTitle/TransactionsTitle";
import TransactionsTotalAmount from "@/components/TransactionsTotalAmount/TransactionsTotalAmount";
import TransactionsChart from "@/components/TransactionsChart/TransactionsChart";
import styles from "./page.module.css";
import TransactionForm from "@/components/TransactionForm/TransactionForm";
import { notFound, useParams } from "next/navigation";
import { CategoryType } from "@/types/category";

export default function MainTransactionsPage() {
  const { transactionType } = useParams<{ transactionType: string }>();

  const validTypes = ["expenses", "incomes"];

  if (!validTypes.includes(transactionType)) {
    notFound();
  }

  const { data: stats = [], isLoading } = useQuery({
    queryKey: ["categoriesStats"],
    queryFn: getCategoriesStats,
  });

  return (
    <div className="container">
      <main className={styles.page}>
        <div className={styles.left}>
          <TransactionsTitle />
          <TransactionsTotalAmount />
        </div>
        <div className={styles.right}>
          <TransactionForm initialType={transactionType as CategoryType} />
        </div>
        <div className={styles.chart}>
          <TransactionsChart rawStats={stats} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
}
