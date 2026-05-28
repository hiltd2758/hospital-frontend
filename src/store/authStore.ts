import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Role } from "@/types";

interface AuthStore {
  role: Role | null;
  isAuthenticated: boolean;
  setAuth: (role: Role) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      role: null,
      isAuthenticated: false,
      setAuth: (role) => set({ role, isAuthenticated: true }),
      clearAuth: () => set({ role: null, isAuthenticated: false }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        role: state.role,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);