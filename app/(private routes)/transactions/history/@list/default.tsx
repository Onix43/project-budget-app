import { redirect } from "next/navigation";

export default function ListDefault() {
  redirect("/transactions/history/expenses");
}
