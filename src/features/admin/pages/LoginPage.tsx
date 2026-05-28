import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminApi } from "@/api";
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
            await adminApi.login({ email, password });
            const res = await adminApi.login({ email, password });
            setAuth(res.data.token, "ADMIN");
            navigate("/admin/dashboard");
        } catch {
            setError("Email hoặc mật khẩu không đúng");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow w-full max-w-md flex flex-col gap-4">
                <h1 className="text-2xl font-bold text-center text-purple-700">Đăng nhập Admin</h1>
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Email</label>
                    <input type="email" required value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                        placeholder="admin@hospital.com" />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Mật khẩu</label>
                    <input type="password" required value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                        placeholder="••••••••" />
                </div>
                <button type="submit" disabled={loading}
                    className="bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 font-medium">
                    {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>
            </form>
        </div>
    );
}