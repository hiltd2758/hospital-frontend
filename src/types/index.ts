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

export interface Patient {
  id: number;
  email: string;
  fullName: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address: string;
  dateOfBirth: string;
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
  [key: string]: unknown;
}

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

export type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED";

export interface AppointmentRequest {
  patientId: number;
  doctorId: number;
  scheduleTime: string;
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

export interface DashboardStats {
  totalPatients?: number;
  totalDoctors?: number;
  totalAppointments?: number;
  [key: string]: unknown;
}

export interface AdminStatistics {
  totalDoctors: number;
  totalPatients: number;
  totalAppointments: number;
  pending: number;
  confirmed: number;
  cancelled: number;
}

export interface ApiError {
  error: string;
}

export interface ApiMessage {
  message: string;
}