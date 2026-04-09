import Link from "next/link";
import css from "./ErrorPages.module.css";

export default function NotFound() {
  return (
    <div className={css.container}>
      <h1 className={css.errorCode}>404</h1>
      <h2 className={css.title}>Oops! Page not found</h2>
      <p className={css.text}>
        The page you are looking for might have been removed or is temporarily
        unavailable.
      </p>
      <Link href="/transactions/expenses" className={css.linkButton}>
        Back to Home
      </Link>
    </div>
  );
}
