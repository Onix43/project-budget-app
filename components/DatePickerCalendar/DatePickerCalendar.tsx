"use client";
import DatePicker from "react-datepicker";
import css from "./DatePickerCalendar.module.css";

import { registerLocale } from "react-datepicker";
import { enGB } from "date-fns/locale/en-GB";
import { CustomCalendarInput } from "../CustomCalendarInput/CustomCalendarInput";
import { useState } from "react";

registerLocale("en-GB", enGB);

interface DatePickerCalendarProps {
  selected: Date;
  onChange: (date: Date | null) => void;
  dateFormat: string;
}

export default function DatePickerCalendar({
  selected,
  onChange,
  dateFormat,
}: DatePickerCalendarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DatePicker
      selected={selected}
      onChange={onChange}
      dateFormat={dateFormat}
      className={css.input}
      calendarClassName="calendar"
      popperClassName={css.popper}
      onCalendarOpen={() => setIsOpen(true)}
      onCalendarClose={() => setIsOpen(false)}
      showPopperArrow={false}
      locale="en-GB"
      customInput={<CustomCalendarInput isOpen={isOpen} />}
    />
  );
}
