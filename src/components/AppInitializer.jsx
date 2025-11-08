import { useEffect } from "react";
import LoadingSpinner from "~/components/Feedback/LoadingSpinner";
import { useAuthStore } from "~/store/authStore";

export function AppInitializer({ children }) {
  const { initAuth, authInitializing } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  if (authInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <LoadingSpinner 
          message="Loading..." 
          variant="inline" 
          size="lg" 
        />
      </div>
    );
  }

  return children;
}
