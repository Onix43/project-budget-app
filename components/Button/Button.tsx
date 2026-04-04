"use client";
import { ReactNode } from "react";
import css from "./Button.module.css";
export type ButtonColor = "green" | "dark" | "gray";

interface ButtonProps {
  color: ButtonColor;
  text: string;
  onClick: () => void;
  icon?: ReactNode;
}

export default function Button({ color, text, onClick, icon }: ButtonProps) {
  return (
    <button onClick={onClick} className={`${css.primary} ${css[color]}`}>
      {icon && <span className={css.icon}>{icon}</span>}
      {text}
    </button>
  );
}
