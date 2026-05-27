import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect } from "react";
import { queryClient } from "@/lib/queryClient";
import { useAuthStore } from "@/store/authStore";
import AppRoutes from "@/routes/AppRoutes";

export default function App() {
  const clearAuth = useAuthStore((s) => s.clearAuth);

  // Lắng nghe 401 từ axios interceptor
  useEffect(() => {
    const handle = () => {
      clearAuth();
    };
    window.addEventListener("auth:unauthorized", handle);
    return () => window.removeEventListener("auth:unauthorized", handle);
  }, [clearAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}