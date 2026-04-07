import { redirect } from "next/navigation";

export default function HistoryDefault() {
  redirect("/transactions/history/expenses");
}
