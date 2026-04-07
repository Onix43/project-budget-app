import styles from './TransactionsTitle.module.css';
export default function TransactionsTitle() {
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Expense Log</h1>
      <p className={styles.description}>
        Capture and organize every penny spent with ease! A clear view of your financial habits at
        your fingertips.
      </p>
    </div>
  );
}
