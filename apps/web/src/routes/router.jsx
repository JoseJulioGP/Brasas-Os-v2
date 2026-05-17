import { createBrowserRouter, Navigate } from "react-router-dom";
import { useAuthStore } from "../features/auth/stores/useAuthStore";
import { LoginPage } from "../features/auth/components/LoginPage";
import { RegisterPage } from "../features/auth/components/RegisterPage";
import DashboardPage from "../features/dashboard/components/DashboardPage";
import { InventoryPage } from "../features/inventory/components/InventoryPage";
import { UsersPage } from "../features/users/components/UsersPage";
import { OrdersPage } from "../features/orders/components/OrdersPage";
import { DashboardLayout } from "../components/DashboardLayout";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user?.rol && !allowedRoles.includes(user.rol)) {
    switch (user.rol) {
      case 'ADMIN':
        return <Navigate to="/admin/usuarios" replace />;
      case 'JEFE':
        return <Navigate to="/dashboard" replace />;
      case 'EMPLEADO':
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
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
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
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute allowedRoles={['ADMIN', 'JEFE']}>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/inventory",
    element: (
      <ProtectedRoute allowedRoles={['ADMIN', 'JEFE']}>
        <InventoryPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/usuarios",
    element: (
      <ProtectedRoute allowedRoles={['ADMIN']}>
        <UsersPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/empleado/pedidos",
    element: (
      <ProtectedRoute allowedRoles={['EMPLEADO']}>
        <OrdersPage />
      </ProtectedRoute>
    ),
  },
]);