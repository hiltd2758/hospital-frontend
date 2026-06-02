import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doctorApi, patientApi } from "@/api";
import type { Patient } from "@/types";

export default function DoctorPatientDetail() {
  const navigate = useNavigate();
  const { patientId } = useParams<{ patientId: string }>();
  
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [clinicalInfo, setClinicalInfo] = useState<Record<string, unknown> | null>(null);
  const [clinicalLoading, setClinicalLoading] = useState(true);
  const [clinicalError, setClinicalError] = useState("");
  
  const [editing, setEditing] = useState(false);
  const [clinicalForm, setClinicalForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState("");
  const [saveError, setSaveError] = useState("");

  // Fetch patient info
  useEffect(() => {
    if (!patientId) {
      setError("ID bệnh nhân không hợp lệ.");
      setLoading(false);
      return;
    }

    const id = parseInt(patientId, 10);
    if (isNaN(id)) {
      setError("ID bệnh nhân không hợp lệ.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    doctorApi
      .getPatient(id)
      .then((res) => {
        setPatient(res.data);
      })
      .catch(() => setError("Không thể tải thông tin bệnh nhân."))
      .finally(() => setLoading(false));
  }, [patientId]);

  // Fetch clinical info
  useEffect(() => {
    if (!patient) return;
    
    setClinicalLoading(true);
    setClinicalError("");
    patientApi
      .getClinicalInfo(patient.id)
      .then((res) => {
        setClinicalInfo(res.data || {});
        const form: Record<string, string> = {};
        Object.entries(res.data || {}).forEach(([key, value]) => {
          form[key] = typeof value === "object" ? JSON.stringify(value) : String(value ?? "");
        });
        setClinicalForm(form);
      })
      .catch(() => setClinicalError("Không thể tải thông tin lâm sàng."))
      .finally(() => setClinicalLoading(false));
  }, [patient]);

  const handleSaveClinical = async () => {
    if (!patient) return;
    
    setSaveError("");
    setSaveSuccess("");
    setSaving(true);
    
    try {
      await doctorApi.updatePatientRecord(patient.id, clinicalForm);
      setClinicalInfo(clinicalForm);
      setEditing(false);
      setSaveSuccess("Cập nhật thông tin lâm sàng thành công!");
      setTimeout(() => setSaveSuccess(""), 3000);
    } catch {
      setSaveError("Cập nhật thất bại.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    const form: Record<string, string> = {};
    Object.entries(clinicalInfo || {}).forEach(([key, value]) => {
      form[key] = typeof value === "object" ? JSON.stringify(value) : String(value ?? "");
    });
    setClinicalForm(form);
    setEditing(false);
    setSaveError("");
  };

  if (loading) return <div className="p-8 text-sm text-gray-400">Đang tải...</div>;

  if (error) return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition mb-4"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Quay lại
      </button>
      <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
        {error}
      </div>
    </div>
  );

  const initials = patient?.firstName?.[0]?.toUpperCase() ?? "P";

  return (
    <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
      {/* Back button */}
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
      <div className="flex items-start gap-4">
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

      {/* Personal Information */}
      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
          Thông tin cá nhân
        </p>
        <div className="bg-white border border-gray-100 rounded-xl p-5 space-y-4">
          <div className="grid grid-cols-2 gap-5">
            <InfoField label="Họ" value={patient?.firstName ?? ""} />
            <InfoField label="Tên" value={patient?.lastName ?? ""} />
            <InfoField label="Số điện thoại" value={patient?.phone ?? ""} />
            <InfoField label="Ngày sinh" value={patient?.dateOfBirth ?? ""} />
          </div>
          <InfoField label="Địa chỉ" value={patient?.address ?? ""} />
        </div>
      </div>

      {/* Clinical Information */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
            Thông tin lâm sàng
          </p>
          {!editing && !clinicalLoading && (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 text-sm px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Chỉnh sửa
            </button>
          )}
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-5">
          {saveSuccess && (
            <div className="text-sm text-green-700 bg-green-50 border border-green-100 rounded-lg px-4 py-3 mb-4">
              {saveSuccess}
            </div>
          )}
          {saveError && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3 mb-4">
              {saveError}
            </div>
          )}
          {clinicalLoading ? (
            <p className="text-sm text-gray-400">Đang tải thông tin lâm sàng...</p>
          ) : clinicalError ? (
            <p className="text-sm text-red-600">{clinicalError}</p>
          ) : clinicalInfo && Object.keys(clinicalInfo).length > 0 ? (
            <div className="space-y-4">
              {Object.keys(clinicalForm).map((key) => (
                <div key={key} className="flex flex-col gap-2">
                  <label className="text-xs text-gray-400 font-medium capitalize">
                    {key.replace(/_/g, " ")}
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={clinicalForm[key] ?? ""}
                      onChange={(e) => setClinicalForm({ ...clinicalForm, [key]: e.target.value })}
                      className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-sm font-medium text-gray-900">
                      {clinicalForm[key] || "—"}
                    </p>
                  )}
                </div>
              ))}

              {editing && (
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSaveClinical}
                    disabled={saving}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
                  >
                    {saving ? "Đang lưu..." : "Lưu thay đổi"}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 border border-gray-200 text-sm rounded-lg hover:bg-gray-50 transition"
                  >
                    Huỷ
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-300">Không có thông tin lâm sàng</p>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-400">{label}</label>
      <p className={`text-sm font-medium ${value ? "text-gray-900" : "text-gray-300"}`}>
        {value || "—"}
      </p>
    </div>
  );
}
