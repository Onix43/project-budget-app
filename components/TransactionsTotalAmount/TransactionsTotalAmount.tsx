'use client';
import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '@/lib/api/clientUserApi';
import styles from './TransactionsTotalAmount.module.css';

const TOTALS = {
  incomes: 5670.258,
  expenses: 3225.821,
};

export default function TransactionsTotalAmount() {
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
  });
  const incomes = user?.transactionsTotal?.incomes ?? TOTALS.incomes;
  const expenses = user?.transactionsTotal?.expenses ?? TOTALS.expenses;
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.icon}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M5 13L13 5M13 5H6M13 5V12"
              stroke="#0c0d0d"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className={styles.info}>
          <p className={styles.label}>Total Income</p>
          <p className={styles.amount}>${incomes.toFixed(3)}</p>
        </div>
      </div>
      <div className={styles.card}>
        <div className={styles.icon}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M13 5L5 13M5 13H12M5 13V6"
              stroke="#0c0d0d"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className={styles.info}>
          <p className={styles.label}>Total Expense</p>
          <p className={styles.amount}>${expenses.toFixed(3)}</p>
        </div>
      </div>
    </div>
  );
}
