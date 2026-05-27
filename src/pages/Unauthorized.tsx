import { useNavigate } from "react-router-dom";

export default function Unauthorized() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-2xl font-bold">403 — Không có quyền truy cập</h1>
      <button
        onClick={() => navigate(-1)}
        className="px-4 py-2 bg-primary text-white rounded-md"
      >
        Quay lại
      </button>
    </div>
  );
}