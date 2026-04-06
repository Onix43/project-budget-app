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

    return (
      <nav className={css.nav}>
      <Button
        className={`${css.navItem} ${isActive("/transactions/history/expenses") ? css.activeBorder : ""}`}
        text="All Expense"
        onClick={() => handleNavClick("/transactions/history/expenses")}
        color={isActive("/transactions/history/expenses") ? "green" : "dark"}
      />
      <Button
        className={`${css.navItem} ${isActive("/transactions/history/incomes") ? css.activeBorder : ""}`}
        text="All Income"
        onClick={() => handleNavClick("/transactions/history/incomes")}
        color={isActive("/transactions/history/incomes") ? "green" : "dark"}
      />
    </nav>
    )
}