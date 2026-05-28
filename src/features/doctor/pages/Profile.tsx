import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doctorApi } from "@/api";
import type { Doctor } from "@/types";

export default function DoctorProfile() {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Partial<Doctor>>({});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    doctorApi
      .getProfile()
      .then((res) => {
        setDoctor(res.data);
        setForm(res.data);
      })
      .catch(() => setError("Không thể tải thông tin."))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!doctor) return;
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      const res = await doctorApi.updateProfile(form);
      setDoctor(res.data);
      setForm(res.data);
      setEditing(false);
      setSuccess("Cập nhật thành công!");
    } catch {
      setError("Cập nhật thất bại.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm(doctor ?? {});
    setEditing(false);
    setError("");
    setSuccess("");
  };

  if (loading) return <div className="p-8 text-sm text-gray-400">Đang tải...</div>;

  const initials = doctor?.firstName?.[0]?.toUpperCase() ?? "D";

  return (
    <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Quay lại
      </button>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700 text-xl font-medium flex-shrink-0">
            {initials}
          </div>
          <div>
            <p className="text-lg font-medium text-gray-900">{doctor?.fullName}</p>
            <p className="text-sm text-gray-500 mt-0.5">{doctor?.email}</p>
            <span className="inline-flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md mt-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Bác sĩ
            </span>
          </div>
        </div>

        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 text-sm px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Chỉnh sửa
          </button>
        )}
      </div>

      {/* Alerts */}
      {success && (
        <div className="text-sm text-green-700 bg-green-50 border border-green-100 rounded-lg px-4 py-3">
          {success}
        </div>
      )}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {/* Personal info */}
      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
          Thông tin cá nhân
        </p>
        <div className="bg-white border border-gray-100 rounded-xl p-5 space-y-5">
          <div className="grid grid-cols-2 gap-5">
            <Field label="Họ" value={(form.firstName as string) ?? ""} editing={editing} onChange={(v) => setForm((f) => ({ ...f, firstName: v }))} />
            <Field label="Tên" value={(form.lastName as string) ?? ""} editing={editing} onChange={(v) => setForm((f) => ({ ...f, lastName: v }))} />
          </div>
          <Field label="Số điện thoại" value={(form.phone as string) ?? ""} editing={editing} onChange={(v) => setForm((f) => ({ ...f, phone: v }))} />
        </div>
      </div>

      {/* Professional info */}
      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
          Chuyên môn
        </p>
        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <Field
            label="Chuyên khoa"
            value={(form.specialization as string) ?? ""}
            editing={editing}
            onChange={(v) => setForm((f) => ({ ...f, specialization: v }))}
          />
        </div>
      </div>

      {editing && (
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition"
          >
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
          <button
            onClick={handleCancel}
            className="px-5 py-2 border border-gray-200 text-sm rounded-lg hover:bg-gray-50 transition"
          >
            Huỷ
          </button>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  editing,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  editing: boolean;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-400">{label}</label>
      {editing ? (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      ) : (
        <p className={`text-sm font-medium ${value ? "text-gray-900" : "text-gray-300"}`}>
          {value || "—"}
        </p>
      )}
    </div>
  );
}