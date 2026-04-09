"use client";

import { useEffect } from "react";
import css from "./ErrorPages.module.css";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className={css.container}>
      <h1 className={css.errorCode}>Error</h1>
      <h2 className={css.title}>Something went wrong!</h2>
      <p className={css.text}>
        An unexpected error occurred. We are already working on fixing it.
      </p>
      <button className={css.linkButton} onClick={() => reset()}>
        Try again
      </button>
    </div>
  );
}
