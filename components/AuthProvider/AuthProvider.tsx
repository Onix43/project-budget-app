"use client";

import { checkSession } from "@/lib/api/clientAuthApi";
import { getCurrentUser } from "@/lib/api/clientUserApi";
import { useUserStore } from "@/lib/store/useUserStore";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

interface Props {
  children: React.ReactNode;
}

const publicRoutes = ["/", "/login", "/register"];

export default function AuthProvider({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const setUser = useUserStore((state) => state.setUser);
  const clearisAuthenticated = useUserStore(
    (state) => state.clearIsAuthenticated,
  );
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const isAuthed = await checkSession();
        if (isAuthed) {
          const user = await getCurrentUser();
          if (user) setUser(user);
        }
      } catch {
        clearisAuthenticated();
        router.push("/");
      }
    };

    fetchUser();
  }, [setUser, clearisAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated && publicRoutes.includes(pathname)) {
      router.replace("/transactions/expenses");
    }
  }, [isAuthenticated, pathname, router]);

  return children;
}
