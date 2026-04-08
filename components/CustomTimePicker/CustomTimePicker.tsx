import Image from "next/image";
import css from "./Custom.module.css";

interface CustomTimePickerProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
}

const CustomTimePicker = ({ value, onChange, name }: CustomTimePickerProps) => {
  return (
    <div className={css.timePickerWrapper}>
      <input
        type="time"
        name={name}
        value={value}
        onChange={onChange}
        className={css.nativeTimeInput}
      />
      <div className={css.iconContainer}>
        <Image
          src="/clock.svg"
          width={20}
          height={20}
          alt="clock"
          className={css.iconCalendar}
        />
      </div>
    </div>
  );
};

export default CustomTimePicker;
