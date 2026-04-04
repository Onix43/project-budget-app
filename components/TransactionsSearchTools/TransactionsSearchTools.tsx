"use client";

import { useState } from "react";
import css from "./TransactionsSearchTools.module.css";

export default function TransactionsSearchTools() {
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");

  return (
    <div className={css.wrapper}>
      <div className={css.searchBox}>
        <input
          className={css.searchInput}
          type="text"
          placeholder="Search for anything.."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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

      <div className={css.dateBox}>
        <input
          className={css.dateInput}
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <svg
          className={css.calendarIcon}
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15.8333 3.33334H4.16667C3.24619 3.33334 2.5 4.07954 2.5 5.00001V16.6667C2.5 17.5871 3.24619 18.3333 4.16667 18.3333H15.8333C16.7538 18.3333 17.5 17.5871 17.5 16.6667V5.00001C17.5 4.07954 16.7538 3.33334 15.8333 3.33334Z"
            stroke="#0EF387"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13.3333 1.66666V4.99999"
            stroke="#0EF387"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6.66667 1.66666V4.99999"
            stroke="#0EF387"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2.5 8.33334H17.5"
            stroke="#0EF387"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
