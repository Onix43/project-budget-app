"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTransaction,
  deleteTransaction,
  TransactionGetResponse,
} from "@/lib/api/clientTransactionApi";
import { useUserStore } from "@/lib/store/useUserStore";
import { CategoryType } from "@/types/category";
import Button from "@/components/Button/Button";
import Modal from "@/components/Modal/Modal";
import EditTransactionForm from "@/components/EditTransactionForm/EditTransactionForm";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import "overlayscrollbars/overlayscrollbars.css";
import css from "./TransactionsList.module.css";

let iziToastCssLoaded = false;
const showToast = (
  type: "success" | "error",
  title: string,
  message: string,
) => {
  if (!iziToastCssLoaded) {
    import("izitoast/dist/css/iziToast.min.css");
    iziToastCssLoaded = true;
  }
  import("izitoast").then((mod) => {
    mod.default[type]({ title, message, position: "topRight" });
  });
};

const DAY_NAMES = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const day = DAY_NAMES[d.getUTCDay()];
  const dd = d.getUTCDate();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const yyyy = d.getUTCFullYear();
  return `${day}, ${dd}.${mm}.${yyyy}`;
}

type SortKey = "category" | "comment" | "date" | "time" | "sum";
type SortDir = "asc" | "desc";

interface TransactionsListProps {
  type: CategoryType;
}

const EditIcon = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.33333 2.66666H2.66666C2.31304 2.66666 1.97391 2.80713 1.72386 3.05718C1.47381 3.30723 1.33333 3.64637 1.33333 3.99999V13.3333C1.33333 13.687 1.47381 14.0261 1.72386 14.2761C1.97391 14.5262 2.31304 14.6667 2.66666 14.6667H12C12.3536 14.6667 12.6928 14.5262 12.9428 14.2761C13.1929 14.0261 13.3333 13.687 13.3333 13.3333V8.66666"
      stroke="#0c0d0d"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.3333 1.66665C12.5986 1.40144 12.9583 1.25244 13.3333 1.25244C13.7084 1.25244 14.0681 1.40144 14.3333 1.66665C14.5986 1.93187 14.7476 2.29157 14.7476 2.66665C14.7476 3.04174 14.5986 3.40144 14.3333 3.66665L7.99999 9.99999L5.33333 10.6667L5.99999 7.99999L12.3333 1.66665Z"
      stroke="#0c0d0d"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DeleteIcon = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2 4H3.33333H14"
      stroke="#fafafa"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.33333 4.00001V2.66668C5.33333 2.31305 5.47381 1.97392 5.72386 1.72387C5.97391 1.47382 6.31304 1.33334 6.66666 1.33334H9.33333C9.68695 1.33334 10.0261 1.47382 10.2761 1.72387C10.5262 1.97392 10.6667 2.31305 10.6667 2.66668V4.00001M12.6667 4.00001V13.3333C12.6667 13.687 12.5262 14.0261 12.2761 14.2762C12.0261 14.5262 11.687 14.6667 11.3333 14.6667H4.66666C4.31304 14.6667 3.97391 14.5262 3.72386 14.2762C3.47381 14.0261 3.33333 13.687 3.33333 13.3333V4.00001H12.6667Z"
      stroke="#fafafa"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const LoaderIcon = (
  <svg
    className={css.spinner}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="8"
      cy="8"
      r="6"
      stroke="#fafafa"
      strokeWidth="2"
      strokeDasharray="28"
      strokeDashoffset="8"
      strokeLinecap="round"
    />
  </svg>
);

function getSortValue(
  item: TransactionGetResponse,
  key: SortKey,
): string | number {
  switch (key) {
    case "category":
      return item.category.categoryName.toLowerCase();
    case "comment":
      return (item.comment ?? "").toLowerCase();
    case "date":
      return item.date;
    case "time":
      return item.time;
    case "sum":
      return item.sum;
  }
}

export default function TransactionsList({ type }: TransactionsListProps) {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const currency = useUserStore(
    (state) => state.user?.currency?.toUpperCase() ?? "UAH",
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingTransaction, setEditingTransaction] =
    useState<TransactionGetResponse | null>(null);
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [colWidths, setColWidths] = useState<Record<string, number>>({});
  const resizingRef = useRef<{
    key: string;
    startX: number;
    startW: number;
  } | null>(null);

  const startResize = useCallback(
    (key: string, e: React.PointerEvent<HTMLSpanElement>) => {
      e.preventDefault();
      e.stopPropagation();
      const th = (e.currentTarget.parentElement as HTMLElement) ?? null;
      if (!th) return;
      const headerRow = th.parentElement as HTMLElement | null;
      const allThs = headerRow
        ? (Array.from(headerRow.children) as HTMLElement[])
        : [];
      const lockedWidths: Record<string, number> = {};
      const keyOrder = ["category", "comment", "date", "time", "sum", "actions"];
      allThs.forEach((el, i) => {
        const k = keyOrder[i];
        if (k) lockedWidths[k] = el.getBoundingClientRect().width;
      });
      resizingRef.current = {
        key,
        startX: e.clientX,
        startW: lockedWidths[key] ?? th.getBoundingClientRect().width,
      };
      setColWidths(lockedWidths);
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
      document.body.style.userSelect = "none";
      document.body.style.cursor = "col-resize";
      const onMove = (ev: PointerEvent) => {
        if (!resizingRef.current) return;
        const delta = ev.clientX - resizingRef.current.startX;
        const next = Math.max(60, resizingRef.current.startW + delta);
        setColWidths((prev) => ({ ...prev, [resizingRef.current!.key]: next }));
      };
      const onUp = () => {
        resizingRef.current = null;
        document.body.style.userSelect = "";
        document.body.style.cursor = "";
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
    [],
  );

  const colStyle = (key: string) =>
    colWidths[key] ? { width: colWidths[key], minWidth: colWidths[key] } : undefined;

  const renderExpandable = (id: string, key: string, content: ReactNode) => {
    const fullId = `${key}-${id}`;
    return (
      <span
        className={`${css.ellipsis} ${expandedId === fullId ? css.expanded : ""}`}
        onPointerEnter={(e) => {
          if (e.pointerType === "mouse") setExpandedId(fullId);
        }}
        onPointerLeave={(e) => {
          if (e.pointerType === "mouse") setExpandedId(null);
        }}
        onClick={() =>
          setExpandedId(expandedId === fullId ? null : fullId)
        }
      >
        {content}
      </span>
    );
  };

  const search = searchParams.get("search") ?? "";
  const date = searchParams.get("date") ?? "";

  const {
    data: transactions = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["transactions", type, date],
    queryFn: () =>
      getTransaction({
        type,
        date: date || undefined,
      }),
    refetchOnMount: false,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["transactions", type],
      });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      showToast("success", "Deleted", "Transaction deleted successfully");
    },
    onError: () => {
      showToast("error", "Error", "Failed to delete transaction");
    },
    onSettled: () => {
      setDeletingId(null);
    },
  });

  const handleDelete = (id: string) => {
    setDeletingId(id);
    deleteMutation.mutate(id);
  };

  const handleSort = useCallback(
    (key: SortKey) => {
      if (sortKey === key) {
        setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
      } else {
        setSortKey(key);
        setSortDir("asc");
      }
    },
    [sortKey],
  );

  const sortArrow = (key: SortKey) => {
    if (sortKey !== key) return null;
    return (
      <span className={css.sortArrow}>
        {sortDir === "asc" ? " \u2191" : " \u2193"}
      </span>
    );
  };

  const processedTransactions = useMemo(() => {
    let result = transactions;

    if (search) {
      const lowerSearch = search.toLowerCase();
      result = result.filter((t: TransactionGetResponse) =>
        t.comment?.toLowerCase().includes(lowerSearch),
      );
    }

    if (sortKey) {
      result = [...result].sort((a, b) => {
        const aVal = getSortValue(a, sortKey);
        const bVal = getSortValue(b, sortKey);
        const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return sortDir === "asc" ? cmp : -cmp;
      });
    }

    return result;
  }, [transactions, search, sortKey, sortDir]);

  useEffect(() => {
    if (isError) {
      showToast("error", "Error", "Failed to load transactions");
    }
  }, [isError]);


  if (isLoading) {
    return (
      <div className={css.tableWrapper}>
        <p className={css.empty}>Loading transactions...</p>
      </div>
    );
  }

  if (processedTransactions.length === 0) {
    return (
      <div className={css.tableWrapper}>
        <p className={css.empty}>
          {search ? "No transactions match your search" : "No transactions yet"}
        </p>
      </div>
    );
  }

  return (
    <>
      <OverlayScrollbarsComponent
        className={css.tableWrapper}
        options={{
          scrollbars: { theme: "os-theme-light", autoHide: "never" },
        }}
        defer
      >
        <table className={css.table}>
          <thead>
            <tr className={css.headerRow}>
              <th
                className={`${css.th} ${css.sortable}`}
                style={colStyle("category")}
                onClick={() => handleSort("category")}
              >
                Category{sortArrow("category")}
                <span
                  className={css.resizer}
                  onPointerDown={(e) => startResize("category", e)}
                  onClick={(e) => e.stopPropagation()}
                />
              </th>
              <th
                className={`${css.th} ${css.sortable}`}
                style={colStyle("comment")}
                onClick={() => handleSort("comment")}
              >
                Comment{sortArrow("comment")}
                <span
                  className={css.resizer}
                  onPointerDown={(e) => startResize("comment", e)}
                  onClick={(e) => e.stopPropagation()}
                />
              </th>
              <th
                className={`${css.th} ${css.sortable}`}
                style={colStyle("date")}
                onClick={() => handleSort("date")}
              >
                Date{sortArrow("date")}
                <span
                  className={css.resizer}
                  onPointerDown={(e) => startResize("date", e)}
                  onClick={(e) => e.stopPropagation()}
                />
              </th>
              <th
                className={`${css.th} ${css.sortable}`}
                style={colStyle("time")}
                onClick={() => handleSort("time")}
              >
                Time{sortArrow("time")}
                <span
                  className={css.resizer}
                  onPointerDown={(e) => startResize("time", e)}
                  onClick={(e) => e.stopPropagation()}
                />
              </th>
              <th
                className={`${css.th} ${css.sortable}`}
                style={colStyle("sum")}
                onClick={() => handleSort("sum")}
              >
                Sum{sortArrow("sum")}
                <span
                  className={css.resizer}
                  onPointerDown={(e) => startResize("sum", e)}
                  onClick={(e) => e.stopPropagation()}
                />
              </th>
              <th className={css.th} style={colStyle("actions")}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {processedTransactions.map((item: TransactionGetResponse) => (
              <tr key={item._id} className={css.row}>
                <td className={css.td} style={colStyle("category")}>
                  {renderExpandable(item._id, "cat", item.category?.categoryName)}
                </td>
                <td className={css.td} style={colStyle("comment")}>
                  {renderExpandable(item._id, "com", item.comment ?? "\u2014")}
                </td>
                <td className={css.td} style={colStyle("date")}>
                  {renderExpandable(item._id, "date", formatDate(item.date))}
                </td>
                <td className={css.td} style={colStyle("time")}>
                  {renderExpandable(item._id, "time", item.time)}
                </td>
                <td className={css.td} style={colStyle("sum")}>
                  {renderExpandable(item._id, "sum", `${item.sum} / ${currency}`)}
                </td>
                <td className={css.td} style={colStyle("actions")}>
                  <div className={css.actions}>
                    <Button
                      color="green"
                      text="Edit"
                      icon={EditIcon}
                      onClick={() => setEditingTransaction(item)}
                    />
                    <Button
                      color="dark"
                      text="Delete"
                      icon={deletingId === item._id ? LoaderIcon : DeleteIcon}
                      onClick={() => handleDelete(item._id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </OverlayScrollbarsComponent>

      {editingTransaction && (
        <Modal onClose={() => setEditingTransaction(null)}>
          <EditTransactionForm
            transaction={editingTransaction}
            onClose={() => setEditingTransaction(null)}
          />
        </Modal>
      )}
    </>
  );
}
