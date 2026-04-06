import TransactionsTitle from '@/components/TransactionsTitle/TransactionsTitle';
import TransactionsTotalAmount from '@/components/TransactionsTotalAmount/TransactionsTotalAmount';
import TransactionsChart from '@/components/TransactionsChart/TransactionsChart';
import styles from './page.module.css';

export default function MainTransactionsPage() {
  return (
    <div className="container">
      <main className={styles.page}>
        <div className={styles.left}>
          <TransactionsTitle />
          <TransactionsTotalAmount />
          <TransactionsChart />
        </div>
        <div className={styles.right}>{}</div>
      </main>
    </div>
  );
}
