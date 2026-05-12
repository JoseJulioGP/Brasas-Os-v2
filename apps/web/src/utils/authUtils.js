// Helper para redirigir según el rol del usuario
export const getRedirectPath = (rol) => {
  switch (rol) {
    case 'ADMIN':
      return '/admin/usuarios';
    case 'JEFE':
      return '/dashboard';
    case 'EMPLEADO':
      return '/empleado/pedidos';
    default:
      return '/dashboard';
  }
};

// Verificar si el usuario tiene acceso a la ruta según su rol
export const hasAccess = (userRol, requiredRoles) => {
  if (!userRol) return false;
  if (Array.isArray(requiredRoles)) {
    return requiredRoles.includes(userRol);
  }
  return userRol === requiredRoles;
};