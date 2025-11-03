import { useEffect } from "react";
import UserInfoLoading from "~/components/Feedback/UserInfoLoading";
import { useAuthStore } from "~/store/authStore";

export function AppInitializer({ children }) {
  const { initAuth, authInitializing } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  if (authInitializing) {
    return <UserInfoLoading />;
  }

  return children;
}
