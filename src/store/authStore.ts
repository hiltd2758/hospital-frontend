  import { create } from "zustand";
  import { persist } from "zustand/middleware";
  import type { Role } from "@/types";

  interface AuthStore {
    role: Role | null;
    token: string | null;
    isAuthenticated: boolean;
    setAuth: (role: Role, token?: string) => void;
    clearAuth: () => void;
  }

  export const useAuthStore = create<AuthStore>()(
    persist(
      (set) => ({
        role: null,
        token: null,
        isAuthenticated: false,
        setAuth: (role, token) =>
          set({ role, token: token ?? null, isAuthenticated: true }),
        clearAuth: () => set({ role: null, token: null, isAuthenticated: false }),
      }),
      {
        name: "auth-storage",
        partialize: (state) => ({
          role: state.role,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
        }),
      },
    ),
  );
