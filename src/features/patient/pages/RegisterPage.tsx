import { Link } from "react-router-dom";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="bg-card border rounded-xl p-8 w-full max-w-md shadow-sm">
        <h1 className="text-2xl font-bold mb-2 text-center">Đăng ký tài khoản</h1>
        <p className="text-center text-muted-foreground text-sm mb-6">
          — trang này sẽ được xây dựng tiếp —
        </p>
        <Link to="/login" className="block text-center text-primary hover:underline text-sm">
          ← Quay lại đăng nhập
        </Link>
      </div>
    </div>
  );
}