"use client";

import { useEffect, useState, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import FullPageLoader from "./FullPageLoader";

function LoaderContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  // Залишив таймер щоб не блимало
  useEffect(() => {
    setIsLoading(true);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return isLoading ? <FullPageLoader /> : null;
}

export default function NavigationLoader() {
  return (
    <Suspense fallback={null}>
      <LoaderContent />
    </Suspense>
  );
}
