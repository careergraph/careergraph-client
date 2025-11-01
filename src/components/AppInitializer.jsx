import { useEffect } from "react";
import { useAuthStore } from "~/store/authStore";

export function AppInitializer({ children }) {
const { initAuth, authInitializing } = useAuthStore();
  useEffect(() => {
    initAuth();
  }, [initAuth]);
  if (authInitializing) return <div>Đang tải thông tin người dùng...</div>;
  return children;
}
