"use client";
import { ReactNode } from "react";
import css from "./Button.module.css";
export type ButtonColor = "green" | "dark" | "gray";

interface ButtonProps {
  color: ButtonColor;
  text: string;
  onClick?: () => void;
  className?: string;
  icon?: ReactNode;
  type?: string;
  disabled?: boolean;
}

export default function Button({
  color,
  text,
  onClick,
  className,
  icon,
  disabled,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled ?? false}
      className={`${css.primary} ${css[color]} ${className || ""}`}
    >
      {icon && <span className={css.icon}>{icon}</span>}
      {text}
    </button>
  );
}
