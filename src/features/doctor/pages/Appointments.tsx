import { useEffect, useState } from "react";
import { doctorApi } from "@/api";
import type { Appointment, AppointmentStatus } from "@/types";

const STATUS_MAP: Record<AppointmentStatus, { label: string; cls: string }> = {
  PENDING:   { label: "Chờ xác nhận", cls: "bg-amber-100 text-amber-900" },
  CONFIRMED: { label: "Đã xác nhận",  cls: "bg-green-100 text-green-900" },
  COMPLETED: { label: "Hoàn thành",   cls: "bg-blue-100 text-blue-900" },
  CANCELLED: { label: "Đã huỷ",       cls: "bg-red-100 text-red-900" },
};

const FILTERS: { label: string; value: AppointmentStatus | "ALL" }[] = [
  { label: "Tất cả",        value: "ALL" },
  { label: "Chờ xác nhận", value: "PENDING" },
  { label: "Đã xác nhận",  value: "CONFIRMED" },
  { label: "Hoàn thành",   value: "COMPLETED" },
  { label: "Đã huỷ",       value: "CANCELLED" },
];

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading]           = useState(true);
  const [filter, setFilter]             = useState<AppointmentStatus | "ALL">("ALL");
  const [search, setSearch]             = useState("");
  const [updating, setUpdating]         = useState<number | null>(null);

  useEffect(() => {
    doctorApi.getAppointments()
      .then((res) => setAppointments(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleUpdateStatus = async (id: number, status: AppointmentStatus) => {
    setUpdating(id);
    try {
      await doctorApi.updateAppointmentStatus(id, status);
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a))
      );
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  const filtered = appointments.filter((a) => {
    const matchFilter = filter === "ALL" || a.status === filter;
    const matchSearch = !search || (a.patientName ?? "").toLowerCase()
      .includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  if (loading) return <div className="p-8 text-gray-500">Đang tải...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý lịch hẹn</h1>
          <p className="text-sm text-gray-500 mt-1">{filtered.length} lịch hẹn</p>
        </div>
        <a href="/doctor/dashboard" className="text-sm text-blue-600 hover:underline">
          ← Về dashboard
        </a>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Tìm theo tên bệnh nhân..."
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
            className={`px-4 py-1.5 rounded-full text-sm border transition ${
              filter === f.value
                ? "bg-gray-900 text-white border-gray-900"
                : "border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Bệnh nhân</th>
              <th className="px-4 py-3 text-left font-medium">Thời gian</th>
              <th className="px-4 py-3 text-left font-medium">Trạng thái</th>
              <th className="px-4 py-3 text-left font-medium">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-gray-400">
                  Không có lịch hẹn nào.
                </td>
              </tr>
            ) : (
              filtered.map((a) => (
                <AppointmentRow
                  key={a.id}
                  appt={a}
                  updating={updating === a.id}
                  onUpdateStatus={handleUpdateStatus}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AppointmentRow({
  appt,
  updating,
  onUpdateStatus,
}: {
  appt: Appointment;
  updating: boolean;
  onUpdateStatus: (id: number, status: AppointmentStatus) => void;
}) {
  const s = STATUS_MAP[appt.status] ?? { label: appt.status, cls: "bg-gray-100 text-gray-600" };
  const dt = new Date(appt.scheduleTime);

  return (
    <tr className="border-t border-gray-100 hover:bg-gray-50 transition">
      <td className="px-4 py-3 font-medium text-gray-900">
        {appt.patientName ?? `Bệnh nhân #${appt.patientId}`}
      </td>
      <td className="px-4 py-3 text-gray-500">
        {dt.toLocaleDateString("vi-VN")}{" "}
        {dt.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
      </td>
      <td className="px-4 py-3">
        <span className={`text-xs font-medium px-3 py-1 rounded-full ${s.cls}`}>
          {s.label}
        </span>
      </td>
      <td className="px-4 py-3">
        <ActionButtons
          status={appt.status}
          disabled={updating}
          onConfirm={() => onUpdateStatus(appt.id, "CONFIRMED")}
          onComplete={() => onUpdateStatus(appt.id, "COMPLETED")}
          onCancel={() => onUpdateStatus(appt.id, "CANCELLED")}
        />
      </td>
    </tr>
  );
}

function ActionButtons({
  status,
  disabled,
  onConfirm,
  onComplete,
  onCancel,
}: {
  status: AppointmentStatus;
  disabled: boolean;
  onConfirm: () => void;
  onComplete: () => void;
  onCancel: () => void;
}) {
  const base = "px-3 py-1 rounded-lg text-xs font-medium border transition disabled:opacity-50";

  if (status === "PENDING") return (
    <div className="flex gap-2">
      <button disabled={disabled} onClick={onConfirm}
        className={`${base} border-green-300 text-green-800 hover:bg-green-50`}>
        Xác nhận
      </button>
      <button disabled={disabled} onClick={onCancel}
        className={`${base} border-red-200 text-red-700 hover:bg-red-50`}>
        Huỷ
      </button>
    </div>
  );

  if (status === "CONFIRMED") return (
    <div className="flex gap-2">
      <button disabled={disabled} onClick={onComplete}
        className={`${base} border-blue-200 text-blue-800 hover:bg-blue-50`}>
        Hoàn thành
      </button>
      <button disabled={disabled} onClick={onCancel}
        className={`${base} border-red-200 text-red-700 hover:bg-red-50`}>
        Huỷ
      </button>
    </div>
  );

  return <span className="text-gray-400 text-xs">—</span>;
}