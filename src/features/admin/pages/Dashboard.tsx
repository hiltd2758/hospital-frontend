import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminApi } from "@/api";
import { useAuthStore } from "@/store/authStore";
import type { AdminStatistics } from "@/types";

export default function Dashboard() {
  const navigate = useNavigate();
  const { clearAuth } = useAuthStore();
  const [stats, setStats] = useState<AdminStatistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getStatistics()
      .then((res) => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    try { await adminApi.logout(); } catch { }
    finally {
      clearAuth();
      navigate("/admin/login", { replace: true });
    }
  };

  if (loading) return <div className="p-8 text-gray-500">Đang tải...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Xin chào, Admin 👋</h1>
          <p className="text-gray-500 mt-1 text-sm">Tổng quan hệ thống bệnh viện.</p>
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

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Tổng bác sĩ" value={stats?.totalDoctors ?? 0} color="text-blue-600" />
        <StatCard label="Tổng bệnh nhân" value={stats?.totalPatients ?? 0} color="text-purple-600" />
        <StatCard label="Tổng lịch hẹn" value={stats?.totalAppointments ?? 0} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Chờ xác nhận" value={stats?.pending ?? 0} color="text-yellow-600" />
        <StatCard label="Đã xác nhận" value={stats?.confirmed ?? 0} color="text-green-600" />
        <StatCard label="Đã huỷ" value={stats?.cancelled ?? 0} color="text-red-500" />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">Quản lý</h2>
        <div className="flex gap-3">
          <button onClick={() => navigate("/admin/doctors")} className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50 transition">
            Quản lý bác sĩ
          </button>
          <button onClick={() => navigate("/admin/patients")} className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50 transition">
            Quản lý bệnh nhân
          </button>

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