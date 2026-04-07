import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { getTransaction } from "@/lib/api/serverApi";
import TransactionsList from "@/components/TransactionsList/TransactionsList";

export default async function IncomesListPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["transactions", "incomes", ""],
    queryFn: () => getTransaction({ type: "incomes" }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TransactionsList type="incomes" />
    </HydrationBoundary>
  );
}
