import { UserProfile } from "@/types/user";
import { create } from "zustand";

interface UserStore {
  user: UserProfile | null;
  isAuthenticated: boolean;
  setUser: (newUser: UserProfile) => void;
  clearIsAuthenticated: () => void;
}

export const useUserStore = create<UserStore>()((setStore) => ({
  user: null,
  isAuthenticated: false,

  setUser: (user) => {
    setStore({ user: user, isAuthenticated: true });
  },

  clearIsAuthenticated: () => {
    setStore({ user: null, isAuthenticated: false });
  },
}));
