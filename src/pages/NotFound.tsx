import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-2xl font-bold">404 — Trang không tồn tại</h1>
      <button
        onClick={() => navigate("/")}
        className="px-4 py-2 bg-primary text-white rounded-md"
      >
        Về trang chủ
      </button>
    </div>
  );
}