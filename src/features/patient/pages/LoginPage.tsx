import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { patientApi } from "@/api";
import { useAuthStore } from "@/store/authStore";

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setLoading(true);
  try {
    const res = await patientApi.login({ email, password });
console.log(res.data); // debug: phải thấy { message: "Login successful" }
setAuth("patient"); // chỉ set role, không cần token
navigate("/patient/dashboard");
  } catch {
    setError("Email hoặc mật khẩu không đúng");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow w-full max-w-md flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-center text-blue-700">Đăng nhập Bệnh nhân</h1>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Email</label>
          <input type="email" required value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="example@email.com" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Mật khẩu</label>
          <input type="password" required value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="••••••••" />
        </div>
        <button type="submit" disabled={loading}
          className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium">
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
        <p className="text-sm text-center text-gray-500">
          Chưa có tài khoản?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">Đăng ký</Link>
        </p>
        <p className="text-sm text-center text-gray-400">
          Bạn là bác sĩ?{" "}
          <Link to="/doctor/login" className="text-blue-500 hover:underline">Đăng nhập tại đây</Link>
        </p>
      </form>
    </div>
  );
}