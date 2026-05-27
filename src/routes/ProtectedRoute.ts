import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import type { Role } from "@/types";

interface ProtectedRouteProps {
  allowedRoles: Role[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, role } = useAuthStore();

  if (!isAuthenticated || !role) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}

// Helper — redirect đến dashboard đúng role sau login
export function getRoleDashboard(role: Role): string {
  switch (role) {
    case "admin":
      return "/admin/dashboard";
    case "doctor":
      return "/doctor/dashboard";
    case "patient":
      return "/patient/dashboard";
  }
}