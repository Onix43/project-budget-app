"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import css from "./CustomDatePicker.module.css";

interface CustomDatePickerProps {
  selected: Date | null;
  onChange: (date: Date) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
}

const WEEK_DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function formatDisplay(d: Date | null): string {
  if (!d) return "";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

function isSameDay(a: Date | null, b: Date): boolean {
  if (!a) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getCalendarGrid(viewDate: Date): Date[] {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  // Monday = 0, ..., Sunday = 6
  const jsDay = firstOfMonth.getDay(); // 0 = Sun
  const mondayOffset = (jsDay + 6) % 7;
  const start = new Date(year, month, 1 - mondayOffset);
  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
    days.push(new Date(start.getFullYear(), start.getMonth(), start.getDate() + i));
  }
  return days;
}

export default function CustomDatePicker({
  selected,
  onChange,
  placeholder = "Select date",
  className,
  inputClassName,
}: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState<Date>(selected ?? new Date());
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selected) setViewDate(selected);
  }, [selected]);

  useEffect(() => {
    if (!isOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [isOpen]);

  const grid = useMemo(() => getCalendarGrid(viewDate), [viewDate]);
  const viewMonth = viewDate.getMonth();

  const goPrev = () =>
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const goNext = () =>
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));

  return (
    <div ref={wrapperRef} className={`${css.wrapper} ${className ?? ""}`}>
      <button
        type="button"
        className={`${css.input} ${inputClassName ?? ""}`}
        onClick={() => setIsOpen((v) => !v)}
      >
        <span className={selected ? css.value : css.placeholder}>
          {selected ? formatDisplay(selected) : placeholder}
        </span>
        <svg
          className={css.icon}
          width="18"
          height="18"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="M15.8333 3.33334H4.16667C3.24619 3.33334 2.5 4.07954 2.5 5.00001V16.6667C2.5 17.5871 3.24619 18.3333 4.16667 18.3333H15.8333C16.7538 18.3333 17.5 17.5871 17.5 16.6667V5.00001C17.5 4.07954 16.7538 3.33334 15.8333 3.33334Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13.3333 1.66666V4.99999"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6.66667 1.66666V4.99999"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2.5 8.33334H17.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className={css.popover}>
          <div className={css.header}>
            <button
              type="button"
              className={css.navBtn}
              onClick={goPrev}
              aria-label="Previous month"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path
                  d="M10 12L6 8L10 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <span className={css.title}>
              {MONTH_NAMES[viewMonth]} {viewDate.getFullYear()}
            </span>
            <button
              type="button"
              className={css.navBtn}
              onClick={goNext}
              aria-label="Next month"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path
                  d="M6 4L10 8L6 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div className={css.weekRow}>
            {WEEK_DAYS.map((d) => (
              <span key={d} className={css.weekDay}>
                {d}
              </span>
            ))}
          </div>

          <div className={css.grid}>
            {grid.map((day, i) => {
              const outside = day.getMonth() !== viewMonth;
              const isSelected = isSameDay(selected, day);
              return (
                <button
                  key={i}
                  type="button"
                  className={`${css.day} ${outside ? css.outside : ""} ${
                    isSelected ? css.selected : ""
                  }`}
                  onClick={() => {
                    onChange(day);
                    setIsOpen(false);
                  }}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
