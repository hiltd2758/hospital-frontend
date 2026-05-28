import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { patientApi } from "@/api";

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  dateOfBirth: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
    errors.email = "Email không hợp lệ";
  if (data.password.length < 6)
    errors.password = "Mật khẩu tối thiểu 6 ký tự";
  if (data.password !== data.confirmPassword)
    errors.confirmPassword = "Mật khẩu xác nhận không khớp";
  if (!data.firstName.trim())
    errors.firstName = "Vui lòng nhập họ";
  if (!data.lastName.trim())
    errors.lastName = "Vui lòng nhập tên";
  if (data.phone && !data.phone.match(/^[0-9]{9,11}$/))
    errors.phone = "Số điện thoại không hợp lệ";
  return errors;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormData>({
    email: "", password: "", confirmPassword: "",
    firstName: "", lastName: "", phone: "", address: "", dateOfBirth: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    setSuccessMessage("");
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    try {
      await patientApi.register({
        email: form.email,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone || undefined,
        address: form.address || undefined,
        dateOfBirth: form.dateOfBirth || undefined,
      });
      setSuccessMessage("✓ Đăng ký thành công! Chuyển hướng đến trang đăng nhập...");
      setTimeout(() => {
        navigate("/login", { state: { registered: true } });
      }, 2000);
    } catch (err: unknown) {
      console.error("Register error:", err);
      const msg = (err as { response?: { data?: { error?: string } } })
        ?.response?.data?.error;
      setServerError(msg || "Đăng ký thất bại, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10 px-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-lg p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-50 mb-3">
            <svg className="w-7 h-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Tạo tài khoản</h1>
          <p className="text-sm text-gray-500 mt-1">Đăng ký để đặt lịch khám bệnh</p>
        </div>

        {serverError && (
          <div className="mb-5 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-4.75a.75.75 0 001.5 0v-4.5a.75.75 0 00-1.5 0v4.5zm.75-8a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
            </svg>
            {serverError}
          </div>
        )}

        {successMessage && (
          <div className="mb-5 flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3">
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Họ + Tên */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Họ *" error={errors.firstName}>
              <input value={form.firstName} onChange={set("firstName")}
                placeholder="Nguyễn" className={inputCls(errors.firstName)} />
            </Field>
            <Field label="Tên *" error={errors.lastName}>
              <input value={form.lastName} onChange={set("lastName")}
                placeholder="Văn A" className={inputCls(errors.lastName)} />
            </Field>
          </div>

          <Field label="Email *" error={errors.email}>
            <input type="email" value={form.email} onChange={set("email")}
              placeholder="example@email.com" className={inputCls(errors.email)} />
          </Field>

          <Field label="Mật khẩu *" error={errors.password}>
            <input type="password" value={form.password} onChange={set("password")}
              placeholder="Tối thiểu 6 ký tự" className={inputCls(errors.password)} />
          </Field>

          <Field label="Xác nhận mật khẩu *" error={errors.confirmPassword}>
            <input type="password" value={form.confirmPassword} onChange={set("confirmPassword")}
              placeholder="Nhập lại mật khẩu" className={inputCls(errors.confirmPassword)} />
          </Field>

          <Field label="Số điện thoại" error={errors.phone}>
            <input type="tel" value={form.phone} onChange={set("phone")}
              placeholder="0912345678" className={inputCls(errors.phone)} />
          </Field>

          <Field label="Ngày sinh">
            <input type="date" value={form.dateOfBirth} onChange={set("dateOfBirth")}
              max={new Date().toISOString().split("T")[0]}
              className={inputCls()} />
          </Field>

          <Field label="Địa chỉ">
            <input value={form.address} onChange={set("address")}
              placeholder="Số nhà, đường, quận, thành phố" className={inputCls()} />
          </Field>

          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-colors">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Đang đăng ký...
              </span>
            ) : "Đăng ký"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Đã có tài khoản?{" "}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}

function Field({ label, error, children }: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function inputCls(error?: string) {
  return [
    "w-full border rounded-lg px-3 py-2 text-sm outline-none transition-colors",
    "focus:ring-2 focus:ring-blue-400 focus:border-transparent",
    error ? "border-red-400 bg-red-50" : "border-gray-300 bg-white",
  ].join(" ");
}