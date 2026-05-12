import { createBrowserRouter, Navigate } from "react-router-dom";
import { useAuthStore } from "../features/auth/stores/useAuthStore";
import { LoginPage } from "../features/auth/components/LoginPage";
import { RegisterPage } from "../features/auth/components/RegisterPage";
import DashboardPage from "../features/dashboard/components/DashboardPage";
import { InventoryPage } from "../features/inventory/components/InventoryPage";
import { DashboardLayout } from "../components/DashboardLayout";
const ProtectedRoute = ({ children, allowedRoles }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && user?.rol && !allowedRoles.includes(user.rol)) {
    // Redirigir según el rol del usuario
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
  // Rutas públicas
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
  // Rutas protegidas - Todas requieren autenticación
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
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
  // Rutas de Admin
  {
    path: "/admin/usuarios",
    element: (
      <ProtectedRoute allowedRoles={['ADMIN']}>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  // Rutas de Empleado
  {
    path: "/empleado/pedidos",
    element: (
      <ProtectedRoute allowedRoles={['EMPLEADO']}>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
]);
