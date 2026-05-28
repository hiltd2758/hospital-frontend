import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { patientApi } from "@/api";
import { useAuthStore } from "@/store/authStore";
import type { Patient, Appointment } from "@/types";

export default function Dashboard() {
  const navigate = useNavigate();
  const { clearAuth } = useAuthStore();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([patientApi.getProfile(), patientApi.getAppointments()])
      .then(([profileRes, apptRes]) => {
        setPatient(profileRes.data);
        setAppointments(apptRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
  try {
    await patientApi.logout(); // gọi backend xóa cookie
  } catch {
    // bỏ qua lỗi
  } finally {
    clearAuth();
    navigate("/login", { replace: true });
  }
};

  if (loading) return <div className="p-8 text-gray-500">Đang tải...</div>;

  const upcoming = appointments.filter((a) => a.status === "PENDING" || a.status === "CONFIRMED");
  const total = appointments.length;
  const confirmed = appointments.filter((a) => a.status === "CONFIRMED").length;
  const cancelled = appointments.filter((a) => a.status === "CANCELLED").length;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Header with Logout */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Xin chào, {patient?.fullName ?? patient?.firstName ?? "Bệnh nhân"} 👋
          </h1>
          <p className="text-gray-500 mt-1">Đây là tổng quan lịch khám của bạn.</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium text-sm transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Đăng xuất
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Tổng lịch hẹn" value={total} />
        <StatCard label="Đã xác nhận" value={confirmed} color="text-green-600" />
        <StatCard label="Đã huỷ" value={cancelled} color="text-red-500" />
      </div>

      {/* Upcoming appointments */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Lịch sắp tới</h2>
          <a href="/patient/appointments" className="text-sm text-blue-600 hover:underline">
            Xem tất cả →
          </a>
        </div>

        {upcoming.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-gray-400">
            Không có lịch hẹn nào sắp tới.{" "}
            <a href="/patient/appointments/book" className="text-blue-600 hover:underline">
              Đặt lịch ngay
            </a>
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming.slice(0, 5).map((a) => (
              <AppointmentRow key={a.id} appt={a} />
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Thao tác nhanh</h2>
        <div className="flex gap-3">
          <a href="/patient/appointments/book" className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition">
            Đặt lịch khám
          </a>
          <a href="/patient/profile" className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50 transition">
            Hồ sơ cá nhân
          </a>
          <a href="/patient/appointments" className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50 transition">
            Lịch sử khám
          </a>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  color = "text-gray-900",
}: {
  label: string;
  value: number;
  color?: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
    </div>
  );
}

function AppointmentRow({ appt }: { appt: Appointment }) {
  const statusMap: Record<string, { label: string; cls: string }> = {
    PENDING: { label: "Chờ xác nhận", cls: "bg-yellow-100 text-yellow-800" },
    CONFIRMED: { label: "Đã xác nhận", cls: "bg-green-100 text-green-800" },
    CANCELLED: { label: "Đã huỷ", cls: "bg-red-100 text-red-700" },
    COMPLETED: { label: "Hoàn thành", cls: "bg-gray-100 text-gray-600" },
  };

  const s = statusMap[appt.status] ?? { label: appt.status, cls: "bg-gray-100 text-gray-600" };
  const dt = new Date(appt.scheduleTime);

  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-5 py-4">
      <div>
        <p className="font-medium text-gray-900">
          {appt.doctorName ?? `Bác sĩ #${appt.doctorId}`}
        </p>
        <p className="text-sm text-gray-500 mt-0.5">
          {dt.toLocaleDateString("vi-VN")} lúc {dt.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
      <span className={`text-xs font-medium px-3 py-1 rounded-full ${s.cls}`}>
        {s.label}
      </span>
    </div>
  );
}