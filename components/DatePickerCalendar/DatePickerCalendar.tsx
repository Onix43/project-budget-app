import DatePicker from "react-datepicker";
import css from "./DatePickerCalendar.module.css";

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
  return (
    <DatePicker
      selected={selected}
      onChange={onChange}
      dateFormat={dateFormat}
      className={css.input}
      calendarClassName={css.calendar}
      popperClassName={css.popper}
      showPopperArrow={false}
    />
  );
}
