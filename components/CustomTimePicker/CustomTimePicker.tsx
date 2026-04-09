"use client";

import { useEffect, useRef, useState } from "react";
import css from "./CustomTimePicker.module.css";

interface CustomTimePickerProps {
  value: string;
  onChange: (time: string) => void;
  placeholder?: string;
  className?: string;
  selectedDate?: Date | null;
  isMainForm?: boolean;
}

function isToday(d: Date | null | undefined): boolean {
  if (!d) return false;
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const MINUTES = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, "0"),
);

export default function CustomTimePicker({
  value,
  onChange,
  placeholder = "hh:mm",
  className,
  selectedDate,
  isMainForm,
}: CustomTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const hourListRef = useRef<HTMLDivElement>(null);
  const minuteListRef = useRef<HTMLDivElement>(null);

  const [hh, mm] = value ? value.split(":") : ["", ""];

  const restrictToNow = isToday(selectedDate);
  const now = new Date();
  const maxHour = restrictToNow ? now.getHours() : 23;
  const maxMinute =
    restrictToNow && Number(hh) === now.getHours() ? now.getMinutes() : 59;

  useEffect(() => {
    if (!restrictToNow || !value) return;
    const curH = Number(hh);
    const curM = Number(mm);
    if (curH > now.getHours()) {
      onChange(
        `${String(now.getHours()).padStart(2, "0")}:${String(
          now.getMinutes(),
        ).padStart(2, "0")}`,
      );
    } else if (curH === now.getHours() && curM > now.getMinutes()) {
      onChange(
        `${String(now.getHours()).padStart(2, "0")}:${String(
          now.getMinutes(),
        ).padStart(2, "0")}`,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restrictToNow, value]);

  useEffect(() => {
    if (!isOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const scrollTo = (
      ref: React.RefObject<HTMLDivElement | null>,
      val: string,
    ) => {
      const list = ref.current;
      if (!list) return;
      const selected = list.querySelector<HTMLButtonElement>(
        `[data-val="${val}"]`,
      );
      if (selected) {
        list.scrollTop =
          selected.offsetTop -
          list.clientHeight / 2 +
          selected.clientHeight / 2;
      }
    };
    scrollTo(hourListRef, hh || "00");
    scrollTo(minuteListRef, mm || "00");
  }, [isOpen, hh, mm]);

  const selectHour = (h: string) => {
    if (Number(h) > maxHour) return;
    let newMm = mm || "00";
    if (
      restrictToNow &&
      Number(h) === now.getHours() &&
      Number(newMm) > now.getMinutes()
    ) {
      newMm = String(now.getMinutes()).padStart(2, "0");
    }
    onChange(`${h}:${newMm}`);
  };
  const selectMinute = (m: string) => {
    if (Number(m) > maxMinute) return;
    onChange(`${hh || "00"}:${m}`);
  };

  return (
    <div ref={wrapperRef} className={`${css.wrapper} ${className ?? ""}`}>
      <button
        type="button"
        className={css.input}
        onClick={() => setIsOpen((v) => !v)}
      >
        <span className={value ? css.value : css.placeholder}>
          {value || placeholder}
        </span>
        <svg
          className={`${isMainForm ? css.mainIcon : css.icon} ${isOpen && css.isOpen}`}
          width="18"
          height="18"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="10"
            cy="10"
            r="7.5"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M10 6V10L12.5 11.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className={css.popover}>
          <div className={css.column} ref={hourListRef}>
            {HOURS.map((h) => {
              const disabled = Number(h) > maxHour;
              return (
                <button
                  key={h}
                  type="button"
                  data-val={h}
                  disabled={disabled}
                  className={`${css.item} ${h === hh ? css.selected : ""} ${
                    disabled ? css.disabled : ""
                  }`}
                  onClick={() => selectHour(h)}
                >
                  {h}
                </button>
              );
            })}
          </div>
          <div className={css.separator}>:</div>
          <div className={css.column} ref={minuteListRef}>
            {MINUTES.map((m) => {
              const disabled = Number(m) > maxMinute;
              return (
                <button
                  key={m}
                  type="button"
                  data-val={m}
                  disabled={disabled}
                  className={`${css.item} ${m === mm ? css.selected : ""} ${
                    disabled ? css.disabled : ""
                  }`}
                  onClick={() => selectMinute(m)}
                >
                  {m}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
