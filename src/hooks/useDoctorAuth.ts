import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { doctorApi } from "@/api";
import { useAuthStore } from "@/store/authStore";
import type { LoginRequest } from "@/types";

export function useDoctorLogin() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (data: LoginRequest) => doctorApi.login(data),
    onSuccess: () => {
      setAuth("doctor");
      navigate("/doctor/dashboard");
    },
  });
}

export function useDoctorLogout() {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((s) => s.clearAuth);

  return useMutation({
    mutationFn: () => doctorApi.logout(),
    onSettled: () => {
      clearAuth();
      navigate("/doctor/login");
    },
  });
}