import { createBrowserRouter, Navigate } from "react-router-dom";
import { useAuthStore } from "../features/auth/stores/useAuthStore";
import { LoginPage } from "../features/auth/components/LoginPage";
import { RegisterPage } from "../features/auth/components/RegisterPage";
import { LandingPage } from "../features/landing/components/LandingPage";
import DashboardPage from "../features/dashboard/components/DashboardPage";
import { InventoryPage } from "../features/inventory/components/InventoryPage";
import { MenuPage } from "../features/menu/components/MenuPage";
import { UsersPage } from "../features/users/components/UsersPage";
import { OrdersPage } from "../features/orders/components/OrdersPage";
import { HistoryPage } from "../features/history/components/HistoryPage";
import { AnalyticsPage } from "../features/analytics/components/AnalyticsPage";
import { DashboardLayout } from "../layout/DashboardLayout";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user?.rol && !allowedRoles.includes(user.rol)) {
    switch (user.rol) {
      case "ADMIN":
        return <Navigate to="/admin/usuarios" replace />;
      case "JEFE":
        return <Navigate to="/dashboard" replace />;
      case "EMPLEADO":
        return <Navigate to="/empleado/pedidos" replace />;
      default:
        return <Navigate to="/dashboard" replace />;
    }
  }

  return <DashboardLayout>{children}</DashboardLayout>;
};

const PublicRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

export const router = createBrowserRouter([
  // Landing pública
  {
    path: "/",
    element: <LandingPage />,
  },
  // Rutas públicas (auth)
  {
    path: "/login",
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <PublicRoute>
        <RegisterPage />
      </PublicRoute>
    ),
  },
  // Rutas protegidas
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute allowedRoles={["ADMIN", "JEFE"]}>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/inventory",
    element: (
      <ProtectedRoute allowedRoles={["ADMIN", "JEFE"]}>
        <InventoryPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/analisis",
    element: (
      <ProtectedRoute allowedRoles={["ADMIN", "JEFE"]}>
        <AnalyticsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/menu",
    element: (
      <ProtectedRoute allowedRoles={["ADMIN", "JEFE"]}>
        <MenuPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/historial",
    element: (
      <ProtectedRoute allowedRoles={["ADMIN", "JEFE"]}>
        <HistoryPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/empleado/historial",
    element: (
      <ProtectedRoute allowedRoles={["EMPLEADO"]}>
        <HistoryPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/pedidos",
    element: (
      <ProtectedRoute allowedRoles={["ADMIN", "JEFE"]}>
        <OrdersPage />
      </ProtectedRoute>
    ),
  },
  // Admin
  {
    path: "/admin/usuarios",
    element: (
      <ProtectedRoute allowedRoles={["ADMIN"]}>
        <UsersPage />
      </ProtectedRoute>
    ),
  },
  // Empleado
  {
    path: "/empleado/pedidos",
    element: (
      <ProtectedRoute allowedRoles={["EMPLEADO"]}>
        <OrdersPage />
      </ProtectedRoute>
    ),
  },
]);