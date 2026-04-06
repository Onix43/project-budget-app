'use client';

import css from "./TransactionsHistoryNav.module.css";
import Button from "../Button/Button";
import { useRouter, usePathname } from "next/navigation";

interface Props { 
  onClose?: () => void;
}

export default function TransactionsHistoryNav({ onClose }: Props) {
    const router = useRouter();
    const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  
  const handleNavClick = (path: string) => {
    router.push(path);
    if (onClose) onClose()
  };

  // const handleAllExpense = () => {
  //   router.push("/transactions/expense");
  // };

  // const handleAllIncome = () => {
  //   router.push("/transactions/income");
  // };
    return (
      <nav className={css.nav}>
      <Button
        className={`${css.navItem} ${isActive("/transactions/expense") ? css.activeBorder : ""}`}
        text="All Expense"
        onClick={() => handleNavClick("/transactions/expense")} 
        color={isActive("/transactions/expense") ? "green" : "dark"}
      />
      <Button
        className={`${css.navItem} ${isActive("/transactions/income") ? css.activeBorder : ""}`}
        text="All Income"
        onClick={() => handleNavClick("/transactions/income")} 
        color={isActive("/transactions/income") ? "green" : "dark"}
      />
    </nav>
    )
}