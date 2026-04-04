"use client";
import css from "./Button.module.css";
export type ButtonColor = "green" | "dark" | "gray";

interface ButtonProps {
  color: ButtonColor;
  text: string;
  onClick: () => void;
  className?: string;
}

export default function Button({ color, text, onClick , className, }: ButtonProps) {
  return (
    <button onClick={onClick} className={`${css.primary} ${css[color]} ${className || ""}` }>
      {text}
    </button>
  );
}
