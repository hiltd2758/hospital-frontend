import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { patientApi } from "@/api";
import type { Doctor, AppointmentRequest } from "@/types";

export default function BookAppointment() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<number | "">("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    patientApi.getDoctors()
      .then((res) => setDoctors(res.data))
      .catch(() => setError("Không thể tải danh sách bác sĩ."))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedDoctor || !scheduleTime) {
      setError("Vui lòng chọn bác sĩ và thời gian.");
      return;
    }

    try {
      setSubmitting(true);
      const profileRes = await patientApi.getProfile();
      const patientId = profileRes.data.id;

      const payload: AppointmentRequest = {
        patientId,
        doctorId: Number(selectedDoctor),
        scheduleTime: new Date(scheduleTime).toISOString(),
      };

      await patientApi.bookAppointment(payload);
      setSuccess("Đặt lịch thành công!");
      setSelectedDoctor("");
      setScheduleTime("");
    } catch {
      setError("Đặt lịch thất bại. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="p-8 max-w-xl mx-auto space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium mb-2 transition"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Quay lại
      </button>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Đặt lịch khám</h1>
        <p className="text-gray-500 mt-1 text-sm">Chọn bác sĩ và thời gian phù hợp.</p>
      </div>

      {success && (
        <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-green-800 text-sm">
          {success}
        </div>
      )}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 bg-white border border-gray-200 rounded-xl p-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bác sĩ</label>
          {loading ? (
            <p className="text-sm text-gray-400">Đang tải...</p>
          ) : (
            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Chọn bác sĩ --</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.fullName ?? `${d.firstName} ${d.lastName}`}
                  {d.specialization ? ` — ${d.specialization}` : ""}
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian khám</label>
          <input
            type="datetime-local"
            value={scheduleTime}
            onChange={(e) => setScheduleTime(e.target.value)}
            min={new Date().toISOString().slice(0, 16)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 text-white text-sm font-medium py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {submitting ? "Đang đặt lịch..." : "Xác nhận đặt lịch"}
        </button>
      </form>

      <a href="/patient/appointments" className="block text-center text-sm text-blue-600 hover:underline">
        Xem lịch hẹn của tôi →
      </a>
    </div>
  );
}