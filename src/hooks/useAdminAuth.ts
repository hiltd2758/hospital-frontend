import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { adminApi } from "@/api";
import { useAuthStore } from "@/store/authStore";
import type { LoginRequest } from "@/types";

export function useAdminLogin() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: (data: LoginRequest) => adminApi.login(data),
    onSuccess: () => {
      setAuth("admin");
      navigate("/admin/dashboard");
    },
  });
}

export function useAdminLogout() {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((s) => s.clearAuth);

  return useMutation({
    mutationFn: () => adminApi.logout(),
    onSettled: () => {
      clearAuth();
      navigate("/admin/login");
    },
  });
}
