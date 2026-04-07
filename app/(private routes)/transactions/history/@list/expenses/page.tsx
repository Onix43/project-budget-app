import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { getTransaction } from "@/lib/api/serverApi";
import TransactionsList from "@/components/TransactionsList/TransactionsList";

export default async function ExpensesListPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["transactions", "expenses", ""],
    queryFn: () => getTransaction({ type: "expenses" }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TransactionsList type="expenses" />
    </HydrationBoundary>
  );
}
