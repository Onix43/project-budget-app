"use client";

import { checkSession } from "@/lib/api/clientAuthApi";
import { getCurrentUser } from "@/lib/api/clientUserApi";
import { useUserStore } from "@/lib/store/useUserStore";
import { useEffect } from "react";

interface Props {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: Props) {
  const setUser = useUserStore((state) => state.setUser);
  const clearisAuthenticated = useUserStore(
    (state) => state.clearIsAuthenticated,
  );

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const isAuthed = await checkSession();
        if (!isAuthed) {
          clearisAuthenticated();
          return;
        }
        const user = await getCurrentUser();
        if (!user) {
          clearisAuthenticated();
          return;
        }
        setUser(user);
      } catch {
        clearisAuthenticated();
      }
    };

    fetchUser();
  }, [setUser, clearisAuthenticated]);
  return children;
}
