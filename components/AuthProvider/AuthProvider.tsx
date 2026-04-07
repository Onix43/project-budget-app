"use client";

import { checkSession } from "@/lib/api/clientAuthApi";
import { getCurrentUser } from "@/lib/api/clientUserApi";
import { useUserStore } from "@/lib/store/useUserStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface Props {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: Props) {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const clearisAuthenticated = useUserStore(
    (state) => state.clearIsAuthenticated,
  );

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
  return children;
}
