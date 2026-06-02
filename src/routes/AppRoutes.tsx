import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { useAuthStore } from "@/store/authStore";

// ─── Auth Pages ───────────────────────────────────────────────────────────────
const LoginPage = lazy(() => import("@/features/patient/pages/LoginPage"));
const RegisterPage = lazy(() => import("@/features/patient/pages/RegisterPage"));
const DoctorLoginPage = lazy(() => import("@/features/doctor/pages/LoginPage"));
const AdminLoginPage = lazy(() => import("@/features/admin/pages/LoginPage"));

// ─── Patient Pages ────────────────────────────────────────────────────────────
const PatientDashboard = lazy(() => import("@/features/patient/pages/Dashboard"));
const PatientProfile = lazy(() => import("@/features/patient/pages/Profile"));
const PatientAppointments = lazy(() => import("@/features/patient/pages/Appointments"));
const BookAppointment = lazy(() => import("@/features/patient/pages/BookAppointment"));

// ─── Doctor Pages ─────────────────────────────────────────────────────────────
const DoctorDashboard = lazy(() => import("@/features/doctor/pages/Dashboard"));
const DoctorProfile = lazy(() => import("@/features/doctor/pages/Profile"));
const DoctorAppointments = lazy(() => import("@/features/doctor/pages/Appointments"));
const DoctorPatientDetail = lazy(() => import("@/features/doctor/pages/PatientDetail"));

// ─── Admin Pages ──────────────────────────────────────────────────────────────
const AdminDashboard = lazy(() => import("@/features/admin/pages/Dashboard"));
const AdminPatients = lazy(() => import("@/features/admin/pages/Patients"));
const AdminDoctors = lazy(() => import("@/features/admin/pages/Doctors"));

// ─── Misc ─────────────────────────────────────────────────────────────────────
const UnauthorizedPage = lazy(() => import("@/pages/Unauthorized"));
const NotFoundPage = lazy(() => import("@/pages/NotFound"));

const ROLE_REDIRECT: Record<string, string> = {
  admin: "/admin/dashboard",
  doctor: "/doctor/dashboard",
  patient: "/patient/dashboard",
};

const Spinner = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
  </div>
);

export default function AppRoutes() {
  const { isAuthenticated, role } = useAuthStore();
  const isLoggedIn = isAuthenticated && !!role;

  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        {/* Root redirect */}
        <Route
          path="/"
          element={
            isLoggedIn
              ? <Navigate to={ROLE_REDIRECT[role] ?? "/login"} replace />
              : <Navigate to="/login" replace />
          }
        />

        {/* Public routes — redirect nếu đã login */}
        <Route path="/login" element={isLoggedIn ? <Navigate to={ROLE_REDIRECT[role!]} replace /> : <LoginPage />} />
        <Route path="/register" element={isLoggedIn ? <Navigate to={ROLE_REDIRECT[role!]} replace /> : <RegisterPage />} />
        <Route path="/doctor/login" element={isLoggedIn ? <Navigate to={ROLE_REDIRECT[role!]} replace /> : <DoctorLoginPage />} />
        <Route path="/admin/login" element={isLoggedIn ? <Navigate to={ROLE_REDIRECT[role!]} replace /> : <AdminLoginPage />} />

        {/* Patient routes */}
        <Route element={<ProtectedRoute allowedRoles={["patient"]} />}>
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/patient/profile" element={<PatientProfile />} />
          <Route path="/patient/appointments" element={<PatientAppointments />} />
          <Route path="/patient/appointments/book" element={<BookAppointment />} />
        </Route>

        {/* Doctor routes */}
        <Route element={<ProtectedRoute allowedRoles={["doctor"]} />}>
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor/profile" element={<DoctorProfile />} />
          <Route path="/doctor/appointments" element={<DoctorAppointments />} />
          <Route path="/doctor/patient/:patientId" element={<DoctorPatientDetail />} />
        </Route>

        {/* Admin routes */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/patients" element={<AdminPatients />} />
          <Route path="/admin/doctors" element={<AdminDoctors />} />
        </Route>

        {/* Misc */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}