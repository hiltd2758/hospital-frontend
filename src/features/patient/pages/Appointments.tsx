import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { patientApi } from "@/api";
import type { Appointment, AppointmentStatus } from "@/types";

const STATUS_MAP: Record<AppointmentStatus, { label: string; cls: string }> = {
  PENDING: { label: "Chờ xác nhận", cls: "bg-amber-100 text-amber-900" },
  CONFIRMED: { label: "Đã xác nhận", cls: "bg-green-100 text-green-900" },
  COMPLETED: { label: "Hoàn thành", cls: "bg-blue-100 text-blue-900" },
  CANCELLED: { label: "Đã huỷ", cls: "bg-red-100 text-red-900" },
};

const FILTERS: { label: string; value: AppointmentStatus | "ALL" }[] = [
  { label: "Tất cả", value: "ALL" },
  { label: "Chờ xác nhận", value: "PENDING" },
  { label: "Đã xác nhận", value: "CONFIRMED" },
  { label: "Hoàn thành", value: "COMPLETED" },
  { label: "Đã huỷ", value: "CANCELLED" },
];

export default function Appointments() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<AppointmentStatus | "ALL">("ALL");
  const [search, setSearch] = useState("");

  useEffect(() => {
    patientApi.getAppointments()
      .then((r) => setAppointments(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = appointments.filter((a) => {
    const matchFilter = filter === "ALL" || a.status === filter;
    const matchSearch = !search ||
      (a.doctorName ?? "").toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium transition"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Quay lại
      </button>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lịch hẹn của tôi</h1>
          <p className="text-sm text-gray-500 mt-1">{filtered.length} lịch hẹn</p>
        </div>
        <Link
          to="/patient/appointments/book"
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
        >
          + Đặt lịch mới
        </Link>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Tìm theo tên bác sĩ..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
      />

      {/* Filter chips */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-1.5 rounded-full text-sm border transition ${filter === f.value
                ? "bg-gray-900 text-white border-gray-900"
                : "border-gray-200 text-gray-500 hover:bg-gray-50"
              }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <svg className="animate-spin w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          Đang tải...
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Bác sĩ</th>
                <th className="px-4 py-3 text-left font-medium">Thời gian</th>
                <th className="px-4 py-3 text-left font-medium">Trạng thái</th>
                <th className="px-4 py-3 text-left font-medium">Mã lịch</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-gray-400">
                    Không có lịch hẹn nào.{" "}
                    <Link
                      to="/patient/appointments/book"
                      className="text-blue-600 hover:underline"
                    >
                      Đặt lịch ngay →
                    </Link>
                  </td>
                </tr>
              ) : (
                filtered.map((a) => {
                  const s = STATUS_MAP[a.status];
                  const dt = new Date(a.scheduleTime);

                  return (
                    <tr
                      key={a.id}
                      className="border-t border-gray-100 hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {a.doctorName ?? `Bác sĩ #${a.doctorId}`}
                      </td>

                      <td className="px-4 py-3 text-gray-500">
                        {dt.toLocaleDateString("vi-VN")}{" "}
                        {dt.toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`text-xs font-medium px-3 py-1 rounded-full ${s.cls}`}
                        >
                          {s.label}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-gray-500 text-sm">
                        #{a.id}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}