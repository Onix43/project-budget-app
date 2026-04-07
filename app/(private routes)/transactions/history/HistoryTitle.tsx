"use client";

import { usePathname } from "next/navigation";

export default function HistoryTitle() {
  const pathname = usePathname();
  const isIncomes = pathname.endsWith("/incomes");
  return <>{isIncomes ? "All Income" : "All Expense"}</>;
}
