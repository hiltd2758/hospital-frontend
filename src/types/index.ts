// ─── Auth ───────────────────────────────────────────────────────────────────

export type Role = "admin" | "doctor" | "patient";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface AuthState {
  role: Role | null;
  isAuthenticated: boolean;
}

// ─── Patient ─────────────────────────────────────────────────────────────────

export interface Patient {
  id: number;
  email: string;
  fullName: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address: string;
  dateOfBirth: string; // ISO date string
  avatar?: string;
}

export interface PatientRegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
}
export interface ClinicalInfo {
  // Extend when backend clarifies fields
  [key: string]: unknown;
}

// ─── Doctor ──────────────────────────────────────────────────────────────────

export interface Doctor {
  id: number;
  email: string;
  fullName: string;
  firstName: string;
  lastName: string;
  phone: string;
  specialization?: string;
  avatar?: string;
  [key: string]: unknown;
}

// ─── Appointment ─────────────────────────────────────────────────────────────

export type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED";

export interface AppointmentRequest {
  patientId: number;
  doctorId: number;
  scheduleTime: string; // ISO datetime string (LocalDateTime)
}

export interface Appointment {
  id: number;
  patientId: number;
  doctorId: number;
  scheduleTime: string;
  status: AppointmentStatus;
  patientName?: string;
  doctorName?: string;
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export interface DashboardStats {
  totalPatients?: number;
  totalDoctors?: number;
  totalAppointments?: number;
  [key: string]: unknown;
}

// ─── API Responses ────────────────────────────────────────────────────────────

export interface ApiError {
  error: string;
}

export interface ApiMessage {
  message: string;
}
