import { forwardRef } from "react";
import Image from "next/image";
import css from "../TransactionForm/TransactionForm.module.css";

interface CustomCalendarInputProps {
  value?: string;
  onClick?: () => void;
  isOpen: boolean;
}

export const CustomCalendarInput = forwardRef<
  HTMLDivElement,
  CustomCalendarInputProps
>(({ value, onClick, isOpen }, ref) => {
  return (
    <div
      ref={ref}
      onClick={onClick}
      className={`
          ${css.calendarInputWrapper} 
          ${isOpen ? css.isOpen : ""} 
        `}
    >
      <input className={css.customInput} value={value} readOnly />
      <Image
        src="/calendar.svg"
        alt="calendar icon"
        width={20}
        height={20}
        className={css.iconCalendar}
      />
    </div>
  );
});

CustomCalendarInput.displayName = "CustomCalendarInput";
