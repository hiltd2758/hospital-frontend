import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { patientApi } from "@/api";
import { useAuthStore } from "@/store/authStore";
import type { LoginRequest, PatientRegisterRequest } from "@/types";

export function usePatientLogin() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (data: LoginRequest) => patientApi.login(data),
    onSuccess: () => {
      setAuth("patient");
      navigate("/patient/dashboard");
    },
  });
}

export function usePatientRegister() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: PatientRegisterRequest) => patientApi.register(data),
    onSuccess: () => {
      navigate("/login");
    },
  });
}

export function usePatientLogout() {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((s) => s.clearAuth);

  return useMutation({
    mutationFn: () => patientApi.logout(),
    onSettled: () => {
      clearAuth();
      navigate("/login");
    },
  });
}