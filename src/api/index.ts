import api from "@/lib/axios";
import type {
  LoginRequest,
  LoginResponse,
  Patient,
  PatientRegisterRequest,
  Doctor,
  Appointment,
  AppointmentRequest,
  AppointmentStatus,
  DashboardStats,
  AdminStatistics,
  ApiMessage,
  ClinicalInfo,
} from "@/types";

export const patientApi = {
  login: (data: LoginRequest) =>
    api.post<LoginResponse>("/api/patient/login", data),

  register: (data: PatientRegisterRequest) =>
    api.post<ApiMessage>("/api/patient/register", data),

  logout: () => api.post<ApiMessage>("/api/patient/logout"),

  getProfile: () => api.get<Patient>("/api/patient/profile"),

  updateProfile: (id: number, data: Partial<Patient>) =>
    api.put<Patient>(`/api/patient/update/${id}`, data),

  getClinicalInfo: (id: number) =>
    api.get<ClinicalInfo>(`/api/patient/clinical-info/${id}`),

  getDoctors: () => api.get<Doctor[]>("/api/patient/appointment/doctors"),

  bookAppointment: (data: AppointmentRequest) =>
    api.post<ApiMessage>("/api/patient/appointment/book", data),

  getAppointments: () =>
    api.get<Appointment[]>("/api/patient/appointment/list"),
};

export const doctorApi = {
  login: (data: LoginRequest) =>
    api.post<LoginResponse>("/api/doctor/login", data),

  logout: () => api.post<ApiMessage>("/api/doctor/logout"),

  getProfile: () => api.get<Doctor>("/api/doctor/profile"),

  updateProfile: (data: Partial<Doctor>) =>
    api.put<Doctor>("/api/doctor/profile/update", data),

  getAppointments: () => api.get<Appointment[]>("/api/doctor/appointment/list"),

  updateAppointmentStatus: (id: number, status: AppointmentStatus) =>
    api.post<ApiMessage>(`/api/doctor/appointment/update/${id}/${status}`),

  getDashboard: () => api.get<DashboardStats>("/api/doctor/dashboard"),

  getPatient: (id: number) =>
    api.get<{ patient: Patient; clinicalInfo: ClinicalInfo }>(
      `/api/doctor/patient/${id}`,
    ),

  updatePatientRecord: (id: number, data: Record<string, unknown>) =>
    api.post<ApiMessage>(`/api/doctor/patient/${id}`, data),
};

export const adminApi = {
  login: (data: LoginRequest) =>
    api.post<LoginResponse>("/api/admin/login", data),

  logout: () => api.post<ApiMessage>("/api/admin/logout"),

  getDashboard: () => api.get<DashboardStats>("/api/admin/dashboard"),

  getStatistics: () => api.get<AdminStatistics>("/api/admin/statistics"),

  deleteDoctor: (id: number) => api.delete(`/api/admin/doctor/delete/${id}`),

  updateDoctor: (data: Partial<Doctor>) =>
    api.put<Doctor>("/api/admin/doctor/update/info", data),

  deletePatient: (id: number) => api.delete(`/api/admin/patient/delete/${id}`),

  updatePatient: (data: Partial<Patient>) =>
    api.put<Patient>("/api/admin/patient/update/info", data),

  updatePatientPassword: (id: number, newPassword: string) =>
    api.put<ApiMessage>(`/api/admin/patient/update/password/${id}`, {
      newPassword,
    }),

  updateDoctorPassword: (id: number, newPassword: string) =>
    api.put<ApiMessage>(`/api/admin/doctor/update/password/${id}`, {
      newPassword,
    }),
};
