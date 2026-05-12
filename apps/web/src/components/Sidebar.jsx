import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../features/auth/stores/useAuthStore";
import { FaFire, FaTachometerAlt, FaBox, FaShoppingCart, FaUsers, FaCog, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
const getNavItems = (rol) => {
  const commonItems = [
    { path: "/dashboard", label: "Dashboard", icon: FaTachometerAlt },
  ];
  const adminItems = [
    { path: "/admin/usuarios", label: "Usuarios", icon: FaUsers },
    { path: "/inventory", label: "Inventario", icon: FaBox },
    { path: "#", label: "Ventas", icon: FaShoppingCart },
  ];
  const jefeItems = [
    { path: "/inventory", label: "Inventario", icon: FaBox },
    { path: "#", label: "Ventas", icon: FaShoppingCart },
  ];
  const empleadoItems = [
    { path: "/empleado/pedidos", label: "Mis Pedidos", icon: FaShoppingCart },
  ];
  const settingsItem = { path: "#", label: "Configuración", icon: FaCog };
  switch (rol) {
    case 'ADMIN':
      return [...commonItems, ...adminItems, settingsItem];
    case 'JEFE':
      return [...commonItems, ...jefeItems, settingsItem];
    case 'EMPLEADO':
      return [...commonItems, ...empleadoItems];
    default:
      return commonItems;
  }
};
export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const navItems = getNavItems(user?.rol);
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const handleNav = (path) => {
    if (path === "#") return;
    navigate(path);
    setMobileOpen(false);
  };
  return (
    <>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 right-4 z-50 w-10 h-10 glass rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/[0.08] transition-all duration-200 lg:hidden"
      >
        {mobileOpen ? <FaTimes /> : <FaBars />}
      </button>
      <aside className={`
        fixed inset-y-0 z-40
        w-[280px] h-screen
        bg-[#0c0c0c] border-r border-white/[0.06]
        flex flex-col
        transition-all duration-300 ease-out
        ${mobileOpen ? "left-0 shadow-2xl shadow-black/50" : "-left-[280px] lg:left-0 lg:shadow-none"}
      `}>
        <div className="p-5 flex items-center gap-3 border-b border-white/[0.06] shrink-0">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
            <FaFire className="text-orange-400 text-lg" />
          </div>
          <div className="flex-1">
            <h1 className="text-base font-heading font-bold text-[#f5f0eb] leading-tight">Brasas OS</h1>
            <p className="text-[10px] text-white/30 font-body">{user?.rol || 'Cargando...'}</p>
          </div>
          <button onClick={() => setMobileOpen(false)} className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-all">
            <FaTimes className="text-sm" />
          </button>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.label}
                onClick={() => handleNav(item.path)}
                disabled={item.path === "#"}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 font-body
                  ${isActive
                    ? "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                    : "text-white/50 hover:text-white/80 hover:bg-white/[0.04] border border-transparent"
                  }
                  ${item.path === "#" && "opacity-40 cursor-not-allowed"}
                `}
              >
                <Icon className="text-base shrink-0" />
                <span className="font-medium">{item.label}</span>
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500 animate-glow-pulse" />}
              </button>
            );
          })}
        </nav>
        <div className="p-3 border-t border-white/[0.04] shrink-0">
          {user && (
            <div className="px-3 py-2 mb-2">
              <p className="text-sm font-medium text-white/80 font-body truncate">{user.nombre || "Usuario"}</p>
              <p className="text-xs text-white/40 font-body truncate">{user.email || ""}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200 font-body"
          >
            <FaSignOutAlt className="text-base shrink-0" />
            <span className="font-medium">Cerrar sesión</span>
          </button>
          <p className="text-[10px] text-white/20 font-number text-center mt-3">v2.0.0</p>
        </div>
      </aside>
      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={() => setMobileOpen(false)} />
      )}
    </>
  );
};
