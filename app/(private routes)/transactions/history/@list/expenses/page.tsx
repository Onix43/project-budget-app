import { cookies } from "next/headers";
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { api } from "@/app/api/api";
import TransactionsList from "@/components/TransactionsList/TransactionsList";

export default async function ExpensesListPage() {
  const queryClient = new QueryClient();
  const cookieStore = await cookies();

  await queryClient.prefetchQuery({
    queryKey: ["transactions", "expenses", ""],
    queryFn: async () => {
      const { data } = await api.get("/transactions/expenses", {
        headers: { Cookie: cookieStore.toString() },
      });
      return data;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TransactionsList type="expenses" />
    </HydrationBoundary>
  );
}
