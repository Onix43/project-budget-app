"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import CustomDatePicker from "@/components/CustomDatePicker/CustomDatePicker";
import css from "./TransactionsSearchTools.module.css";

export default function TransactionsSearchTools() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  // Per mentor: date must NOT persist across reloads — start empty and
  // strip any leftover `date` param from the URL on mount.
  const [date, setDate] = useState<Date | null>(null);
  const didStripDateRef = useRef(false);
  useEffect(() => {
    if (didStripDateRef.current) return;
    didStripDateRef.current = true;
    if (searchParams.get("date")) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("date");
      router.replace(`?${params.toString()}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.replace(`?${params.toString()}`);
    },
    [router, searchParams],
  );

  const debouncedSearch = useDebouncedCallback((value: string) => {
    updateParams("search", value);
  }, 300);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    debouncedSearch(value);
  };

  const handleDateChange = (value: Date | null) => {
    setDate(value);
    if (!value) {
      updateParams("date", "");
      return;
    }
    const yyyy = value.getFullYear();
    const mm = String(value.getMonth() + 1).padStart(2, "0");
    const dd = String(value.getDate()).padStart(2, "0");
    updateParams("date", `${yyyy}-${mm}-${dd}`);
  };

  return (
    <div className={css.wrapper}>
      <div className={css.searchBox}>
        <input
          className={css.searchInput}
          type="text"
          placeholder="Search for anything.."
          value={search}
          onChange={handleSearchChange}
        />
        <svg
          className={css.searchIcon}
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333Z"
            stroke="#0EF387"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17.5 17.5L13.875 13.875"
            stroke="#0EF387"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <CustomDatePicker
        className={css.dateBox}
        inputClassName={css.dateInput}
        selected={date}
        onChange={handleDateChange}
        placeholder="dd.mm.yyyy"
        allowClear
      />
    </div>
  );
}
