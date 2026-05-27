import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { useAuthStore } from "@/store/authStore";

// Lazy load pages
import { lazy, Suspense } from "react";

// ─── Auth Pages ───────────────────────────────────────────────────────────────
const LoginPage = lazy(() => import("@/features/patient/pages/LoginPage"));
const RegisterPage = lazy(() => import("@/features/patient/pages/RegisterPage"));
const DoctorLoginPage = lazy(() => import("@/features/doctor/pages/LoginPage"));
const AdminLoginPage = lazy(() => import("@/features/admin/pages/LoginPage"));

// ─── Patient Pages ────────────────────────────────────────────────────────────
const PatientDashboard = lazy(
  () => import("@/features/patient/pages/Dashboard")
);
const PatientProfile = lazy(() => import("@/features/patient/pages/Profile"));
const PatientAppointments = lazy(
  () => import("@/features/patient/pages/Appointments")
);
const BookAppointment = lazy(
  () => import("@/features/patient/pages/BookAppointment")
);

// ─── Doctor Pages ─────────────────────────────────────────────────────────────
const DoctorDashboard = lazy(
  () => import("@/features/doctor/pages/Dashboard")
);
const DoctorProfile = lazy(() => import("@/features/doctor/pages/Profile"));
const DoctorAppointments = lazy(
  () => import("@/features/doctor/pages/Appointments")
);

// ─── Admin Pages ──────────────────────────────────────────────────────────────
const AdminDashboard = lazy(() => import("@/features/admin/pages/Dashboard"));

// ─── Misc ─────────────────────────────────────────────────────────────────────
const UnauthorizedPage = lazy(() => import("@/components/shared/Unauthorized"));
const NotFoundPage = lazy(() => import("@/components/shared/NotFound"));

const Spinner = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
  </div>
);

export default function AppRoutes() {
  const { isAuthenticated, role } = useAuthStore();

  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        {/* Root redirect */}
        <Route
          path="/"
          element={
            isAuthenticated && role ? (
              <Navigate
                to={
                  role === "admin"
                    ? "/admin/dashboard"
                    : role === "doctor"
                      ? "/doctor/dashboard"
                      : "/patient/dashboard"
                }
                replace
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Public auth routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/doctor/login" element={<DoctorLoginPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Patient routes */}
        <Route element={<ProtectedRoute allowedRoles={["patient"]} />}>
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/patient/profile" element={<PatientProfile />} />
          <Route
            path="/patient/appointments"
            element={<PatientAppointments />}
          />
          <Route path="/patient/appointments/book" element={<BookAppointment />} />
        </Route>

        {/* Doctor routes */}
        <Route element={<ProtectedRoute allowedRoles={["doctor"]} />}>
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor/profile" element={<DoctorProfile />} />
          <Route
            path="/doctor/appointments"
            element={<DoctorAppointments />}
          />
        </Route>

        {/* Admin routes */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>

        {/* Misc */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}