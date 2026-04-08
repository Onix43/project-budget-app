import { cookies } from "next/headers";
import { Suspense } from "react";
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { api } from "@/app/api/api";
import { User } from "@/types/user";
import TransactionsTotalAmount from "@/components/TransactionsTotalAmount/TransactionsTotalAmount";
import TransactionsSearchTools from "@/components/TransactionsSearchTools/TransactionsSearchTools";
import HistoryTitle from "./HistoryTitle";
import css from "./TransactionsHistory.module.css";

interface HistoryLayoutProps {
  list: React.ReactNode;
}

export default async function HistoryLayout({ list }: HistoryLayoutProps) {
  const cookieStore = await cookies();
  const queryClient = new QueryClient();

  try {
    const { data: user } = await api.get<User>("/users/current", {
      headers: { Cookie: cookieStore.toString() },
    });
    queryClient.setQueryData(["currentUser"], user);
  } catch {
    // User data will be fetched client-side via useQuery fallback
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className={css.page}>
        <div className={css.topRow}>
          <div className={css.header}>
            <h1 className={css.title}>
              <HistoryTitle />
            </h1>
            <p className={css.description}>
              View and manage every transaction seamlessly! Your entire financial
              landscape, all in one place.
            </p>
          </div>
          <TransactionsTotalAmount />
        </div>
        <div className={css.content}>
          <Suspense>
            <TransactionsSearchTools />
          </Suspense>
          <Suspense>
            {list}
          </Suspense>
        </div>
      </main>
    </HydrationBoundary>
  );
}
