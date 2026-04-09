"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import css from "./CustomDatePicker.module.css";

interface CustomDatePickerProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  isPostForm?: boolean;
  allowClear?: boolean;
  allowFuture?: boolean;
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

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function formatDisplay(d: Date | null): string {
  if (!d) return "";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}
function reverseDisplay(d: Date | null): string {
  if (!d) return "";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}

function parseManual(input: string): Date | null {
  const s = input.trim();
  if (!s) return null;
  // Accept dd.mm.yyyy, dd/mm/yyyy, dd-mm-yyyy
  const m = s.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/);
  if (!m) return null;
  const dd = Number(m[1]);
  const mm = Number(m[2]);
  const yyyy = Number(m[3]);
  if (mm < 1 || mm > 12 || dd < 1 || dd > 31) return null;
  const d = new Date(yyyy, mm - 1, dd);
  if (
    d.getFullYear() !== yyyy ||
    d.getMonth() !== mm - 1 ||
    d.getDate() !== dd
  ) {
    return null;
  }
  return d;
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
  const jsDay = firstOfMonth.getDay();
  const mondayOffset = (jsDay + 6) % 7;
  const start = new Date(year, month, 1 - mondayOffset);
  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
    days.push(
      new Date(start.getFullYear(), start.getMonth(), start.getDate() + i),
    );
  }
  return days;
}

export default function CustomDatePicker({
  selected,
  onChange,
  placeholder = "dd/mm/yyyy",
  className,
  inputClassName,
  isPostForm,
  allowClear = false,
  allowFuture = false,
}: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState<Date>(selected ?? new Date());
  const [inputText, setInputText] = useState<string>(() =>
    selected
      ? isPostForm
        ? reverseDisplay(selected)
        : formatDisplay(selected)
      : "",
  );
  const wrapperRef = useRef<HTMLDivElement>(null);

  const today = useMemo(() => startOfDay(new Date()), []);

  useEffect(() => {
    if (selected) {
      setViewDate(selected);
      setInputText(
        isPostForm ? reverseDisplay(selected) : formatDisplay(selected),
      );
    } else {
      setInputText("");
    }
  }, [selected, isPostForm]);

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

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInputText("");
    onChange(null);
  };

  const commitManual = () => {
    if (inputText.trim() === "") {
      if (selected) onChange(null);
      return;
    }
    const parsed = parseManual(inputText);
    if (!parsed) {
      // revert to current selected
      setInputText(
        selected
          ? isPostForm
            ? reverseDisplay(selected)
            : formatDisplay(selected)
          : "",
      );
      return;
    }
    if (!allowFuture && parsed > today) {
      setInputText(
        selected
          ? isPostForm
            ? reverseDisplay(selected)
            : formatDisplay(selected)
          : "",
      );
      return;
    }
    onChange(parsed);
    setViewDate(parsed);
  };

  return (
    <div ref={wrapperRef} className={`${css.wrapper} ${className ?? ""}`}>
      <div className={`${css.input} ${inputClassName ?? ""}`}>
        <input
          type="text"
          className={css.textInput}
          value={inputText}
          placeholder={placeholder}
          onChange={(e) => {
            const digits = e.target.value.replace(/\D/g, "").slice(0, 8);
            let formatted = digits;
            if (digits.length >= 4) {
              formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
            } else if (digits.length >= 2) {
              formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
            }
            setInputText(formatted);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={commitManual}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commitManual();
              setIsOpen(false);
            }
          }}
        />
        {allowClear && selected && (
          <button
            type="button"
            className={css.clearBtn}
            onClick={handleClear}
            aria-label="Clear date"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path
                d="M4 4L12 12M12 4L4 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
        <button
          type="button"
          className={css.iconBtn}
          onClick={() => setIsOpen((v) => !v)}
          aria-label="Toggle calendar"
        >
          <svg
            className={`${isPostForm ? css.mainIcon : css.icon} ${isOpen && css.isOpen}`}
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
      </div>

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
              const isDisabled = !allowFuture && day > today;
              return (
                <button
                  key={i}
                  type="button"
                  disabled={isDisabled}
                  className={`${css.day} ${outside ? css.outside : ""} ${
                    isSelected ? css.selected : ""
                  } ${isDisabled ? css.disabled : ""}`}
                  onClick={() => {
                    if (isDisabled) return;
                    onChange(day);
                    setInputText(
                      isPostForm ? reverseDisplay(day) : formatDisplay(day),
                    );
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
