import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { HerouiProvider } from "./providers/HerouiProvider";
import { router } from "./routes/router";
import { useAuthStore } from "./features/auth/stores/useAuthStore";

export const App = () => {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <HerouiProvider>
      <RouterProvider router={router} />
    </HerouiProvider>
  );
};