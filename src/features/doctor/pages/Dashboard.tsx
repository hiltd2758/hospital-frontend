import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doctorApi } from "@/api";
import { useAuthStore } from "@/store/authStore";
import type { Doctor, Appointment } from "@/types";

export default function Dashboard() {
  const navigate = useNavigate();
  const { clearAuth } = useAuthStore();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([doctorApi.getProfile(), doctorApi.getAppointments()])
      .then(([profileRes, apptRes]) => {
        setDoctor(profileRes.data);
        setAppointments(apptRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    try { await doctorApi.logout(); } catch { /* ignore */ }
    finally {
      clearAuth();
      navigate("/doctor/login", { replace: true });
    }
  };

  if (loading) return <div className="p-8 text-gray-500">Đang tải...</div>;

  const pending   = appointments.filter((a) => a.status === "PENDING").length;
  const confirmed = appointments.filter((a) => a.status === "CONFIRMED").length;
  const completed = appointments.filter((a) => a.status === "COMPLETED").length;
  const today = new Date().toDateString();
  const todayList = appointments.filter(
    (a) => new Date(a.scheduleTime).toDateString() === today
  );

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Xin chào, {doctor?.fullName ?? doctor?.firstName ?? "Bác sĩ"} 👋
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            {(doctor as any)?.field ?? ""}
          </p>
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
        <StatCard label="Chờ xác nhận" value={pending} color="text-yellow-600" />
        <StatCard label="Đã xác nhận" value={confirmed} color="text-green-600" />
        <StatCard label="Hoàn thành" value={completed} color="text-blue-600" />
      </div>

      {/* Today */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Lịch hôm nay</h2>
          <a href="/doctor/appointments" className="text-sm text-blue-600 hover:underline">
            Xem tất cả →
          </a>
        </div>

        {todayList.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-gray-400">
            Không có lịch hẹn nào hôm nay.
          </div>
        ) : (
          <div className="space-y-3">
            {todayList.map((a) => (
              <AppointmentRow key={a.id} appt={a} />
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Thao tác nhanh</h2>
        <div className="flex gap-3">
          <a href="/doctor/appointments" className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition">
            Quản lý lịch hẹn
          </a>
          <a href="/doctor/profile" className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50 transition">
            Hồ sơ cá nhân
          </a>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color = "text-gray-900" }: { label: string; value: number; color?: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
    </div>
  );
}

function AppointmentRow({ appt }: { appt: Appointment }) {
  const statusMap: Record<string, { label: string; cls: string }> = {
    PENDING:   { label: "Chờ xác nhận", cls: "bg-yellow-100 text-yellow-800" },
    CONFIRMED: { label: "Đã xác nhận",  cls: "bg-green-100 text-green-800" },
    CANCELLED: { label: "Đã huỷ",       cls: "bg-red-100 text-red-700" },
    COMPLETED: { label: "Hoàn thành",   cls: "bg-gray-100 text-gray-600" },
  };
  const s = statusMap[appt.status] ?? { label: appt.status, cls: "bg-gray-100 text-gray-600" };
  const dt = new Date(appt.scheduleTime);

  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-5 py-4">
      <div>
        <p className="font-medium text-gray-900">
          {appt.patientName ?? `Bệnh nhân #${appt.patientId}`}
        </p>
        <p className="text-sm text-gray-500 mt-0.5">
          {dt.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
      <span className={`text-xs font-medium px-3 py-1 rounded-full ${s.cls}`}>
        {s.label}
      </span>
    </div>
  );
}