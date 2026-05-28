import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { patientApi } from "@/api";
import type { Patient } from "@/types";

export default function PatientProfile() {
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Partial<Patient>>({});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    patientApi
      .getProfile()
      .then((res) => {
        setPatient(res.data);
        setForm(res.data);
      })
      .catch(() => setError("Không thể tải thông tin."))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!patient) return;
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      const res = await patientApi.updateProfile(patient.id, form);
      setPatient(res.data);
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
    setForm(patient ?? {});
    setEditing(false);
    setError("");
    setSuccess("");
  };

  if (loading) return <div className="p-8 text-sm text-gray-400">Đang tải...</div>;

  const initials = patient?.firstName?.[0]?.toUpperCase() ?? "P";

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
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-700 text-xl font-medium flex-shrink-0">
            {initials}
          </div>
          <div>
            <p className="text-lg font-medium text-gray-900">{patient?.fullName}</p>
            <p className="text-sm text-gray-500 mt-0.5">{patient?.email}</p>
            <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md mt-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Bệnh nhân
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

      {/* Section */}
      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
          Thông tin cá nhân
        </p>
        <div className="bg-white border border-gray-100 rounded-xl p-5 space-y-5">
          <div className="grid grid-cols-2 gap-5">
            <Field label="Họ" value={form.firstName ?? ""} editing={editing} onChange={(v) => setForm((f) => ({ ...f, firstName: v }))} />
            <Field label="Tên" value={form.lastName ?? ""} editing={editing} onChange={(v) => setForm((f) => ({ ...f, lastName: v }))} />
            <Field label="Số điện thoại" value={form.phone ?? ""} editing={editing} onChange={(v) => setForm((f) => ({ ...f, phone: v }))} />
            <Field label="Ngày sinh" value={form.dateOfBirth ?? ""} editing={editing} type="date" onChange={(v) => setForm((f) => ({ ...f, dateOfBirth: v }))} />
          </div>
          <Field label="Địa chỉ" value={form.address ?? ""} editing={editing} onChange={(v) => setForm((f) => ({ ...f, address: v }))} />

          {editing && (
            <div className="flex gap-3 pt-1">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
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
      </div>
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
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      ) : (
        <p className={`text-sm font-medium ${value ? "text-gray-900" : "text-gray-300"}`}>
          {value || "—"}
        </p>
      )}
    </div>
  );
}