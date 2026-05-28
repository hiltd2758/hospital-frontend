        import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminApi } from "@/api";
import type { Patient } from "@/types";

type ModalMode = "edit" | "password" | null;

export default function PatientsPage() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selected, setSelected] = useState<Patient | null>(null);
  const [formData, setFormData] = useState<Partial<Patient>>({});
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const fetchPatients = () => {
    setLoading(true);
    adminApi
      .getDashboard()
      .then((res: any) => setPatients(res.data.patients ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const filtered = patients.filter(
    (p) =>
      p.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      p.email?.toLowerCase().includes(search.toLowerCase()) ||
      p.phone?.includes(search)
  );

  const openEdit = (p: Patient) => {
    setSelected(p);
    setFormData({
      id: p.id,
      email: p.email,
      firstName: p.firstName,
      lastName: p.lastName,
      phone: p.phone,
      address: p.address,
      dateOfBirth: p.dateOfBirth,
    });
    setError("");
    setModalMode("edit");
  };

  const openPassword = (p: Patient) => {
    setSelected(p);
    setNewPassword("");
    setError("");
    setModalMode("password");
  };

  const closeModal = () => {
    setModalMode(null);
    setSelected(null);
    setError("");
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleUpdateInfo = async () => {
    if (!selected) return;
    setSaving(true);
    setError("");
    try {
      await adminApi.updatePatient(formData);
      showSuccess("Cập nhật thành công!");
      closeModal();
      fetchPatients();
    } catch {
      setError("Cập nhật thất bại. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!selected || !newPassword.trim()) return;
    setSaving(true);
    setError("");
    try {
      await (adminApi as any).updatePatientPassword(selected.id, newPassword);
      showSuccess("Đổi mật khẩu thành công!");
      closeModal();
    } catch {
      setError("Đổi mật khẩu thất bại. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await adminApi.deletePatient(id);
      showSuccess("Đã xóa bệnh nhân.");
      setDeleteConfirmId(null);
      fetchPatients();
    } catch {
      showSuccess("Xóa thất bại.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast */}
      {successMsg && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium">
          {successMsg}
        </div>
      )}

      <div className="max-w-6xl mx-auto p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="p-2 hover:bg-gray-200 rounded-lg transition"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quản lý bệnh nhân</h1>
              <p className="text-sm text-gray-500 mt-0.5">{patients.length} bệnh nhân trong hệ thống</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            placeholder="Tìm theo tên, email, số điện thoại..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-400 text-sm">Đang tải...</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-gray-400 text-sm">Không tìm thấy bệnh nhân nào.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Bệnh nhân</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Liên hệ</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Ngày sinh</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Địa chỉ</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-semibold text-xs flex-shrink-0">
                          {p.fullName?.charAt(0) ?? "?"}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{p.fullName}</p>
                          <p className="text-gray-400 text-xs">{p.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600">{p.phone ?? "—"}</td>
                    <td className="px-5 py-3.5 text-gray-600">{p.dateOfBirth ?? "—"}</td>
                    <td className="px-5 py-3.5 text-gray-600 max-w-[180px] truncate">{p.address ?? "—"}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(p)}
                          className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => openPassword(p)}
                          className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition"
                        >
                          Mật khẩu
                        </button>
                        {deleteConfirmId === p.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(p.id)}
                              className="px-3 py-1.5 text-xs font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition"
                            >
                              Xác nhận
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition"
                            >
                              Huỷ
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(p.id)}
                            className="px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 rounded-lg transition"
                          >
                            Xóa
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      {modalMode && selected && (
        <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">
                {modalMode === "edit" ? "Cập nhật thông tin" : "Đổi mật khẩu"}
              </h2>
              <button onClick={closeModal} className="p-1 hover:bg-gray-100 rounded-lg transition">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <p className="text-sm text-gray-500">
                Bệnh nhân: <span className="font-medium text-gray-800">{selected.fullName}</span>
              </p>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              {modalMode === "edit" ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Họ" value={formData.firstName ?? ""} onChange={(v) => setFormData((f) => ({ ...f, firstName: v }))} />
                    <Field label="Tên" value={formData.lastName ?? ""} onChange={(v) => setFormData((f) => ({ ...f, lastName: v }))} />
                  </div>
                  <Field label="Email" value={formData.email ?? ""} onChange={(v) => setFormData((f) => ({ ...f, email: v }))} type="email" />
                  <Field label="Số điện thoại" value={formData.phone ?? ""} onChange={(v) => setFormData((f) => ({ ...f, phone: v }))} />
                  <Field label="Ngày sinh" value={formData.dateOfBirth ?? ""} onChange={(v) => setFormData((f) => ({ ...f, dateOfBirth: v }))} type="date" />
                  <Field label="Địa chỉ" value={formData.address ?? ""} onChange={(v) => setFormData((f) => ({ ...f, address: v }))} />
                </>
              ) : (
                <Field
                  label="Mật khẩu mới"
                  value={newPassword}
                  onChange={setNewPassword}
                  type="password"
                  placeholder="Nhập mật khẩu mới..."
                />
              )}
            </div>

            <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100">
              <button onClick={closeModal} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition">
                Huỷ
              </button>
              <button
                onClick={modalMode === "edit" ? handleUpdateInfo : handleUpdatePassword}
                disabled={saving}
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-lg transition"
              >
                {saving ? "Đang lưu..." : "Lưu"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-600">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
      />
    </div>
  );
}