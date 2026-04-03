"use client";
import css from "./Button.module.css";
export type ButtonColor = "green" | "dark" | "gray";

interface ButtonProps {
  color: ButtonColor;
  text: string;
  onClick: () => void;
}

export default function Button({ color, text, onClick }: ButtonProps) {
  return (
    <button onClick={onClick} className={`${css.primary} ${css[color]}`}>
      {text}
    </button>
  );
}
