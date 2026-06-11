import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../features/auth/stores/useAuthStore";
import {
  FaFire, FaTachometerAlt, FaBox, FaShoppingCart,
  FaUsers, FaSignOutAlt, FaBars, FaTimes,
  FaHistory, FaUtensils, FaChartLine, FaUserTie,
} from "react-icons/fa";

/* ── Nav config ── */
const NAV = {
  ADMIN: {
    sections: [
      {
        label: "Principal",
        items: [
          { path: "/dashboard", label: "Dashboard",  icon: FaTachometerAlt },
          { path: "/analisis",  label: "Análisis",   icon: FaChartLine     },
        ],
      },
      {
        label: "Gestión",
        items: [
          { path: "/menu",      label: "Menú",       icon: FaUtensils      },
          { path: "/inventory", label: "Inventario", icon: FaBox           },
          { path: "/pedidos",   label: "Pedidos",    icon: FaShoppingCart  },
          { path: "/historial", label: "Historial",  icon: FaHistory       },
        ],
      },
      {
        label: "Administración",
        items: [
          { path: "/admin/usuarios", label: "Usuarios", icon: FaUsers },
        ],
      },
    ],
    badge: { label: "Admin", color: "bg-rose-500/15 text-rose-300 border-rose-500/25" },
  },
  JEFE: {
    sections: [
      {
        label: "Principal",
        items: [
          { path: "/dashboard", label: "Dashboard",  icon: FaTachometerAlt },
          { path: "/analisis",  label: "Análisis",   icon: FaChartLine     },
        ],
      },
      {
        label: "Gestión",
        items: [
          { path: "/menu",      label: "Menú",       icon: FaUtensils      },
          { path: "/inventory", label: "Inventario", icon: FaBox           },
          { path: "/pedidos",   label: "Pedidos",    icon: FaShoppingCart  },
          { path: "/historial", label: "Historial",  icon: FaHistory       },
        ],
      },
      {
        label: "Equipo",
        items: [
          { path: "/jefe/equipo", label: "Mi Equipo", icon: FaUserTie },
        ],
      },
    ],
    badge: { label: "Jefe", color: "bg-amber-500/15 text-amber-300 border-amber-500/25" },
  },
  EMPLEADO: {
    sections: [
      {
        label: "Mi trabajo",
        items: [
          { path: "/empleado/pedidos", label: "Mis Pedidos", icon: FaShoppingCart },
          { path: "/empleado/menu",    label: "Menú",        icon: FaUtensils     },
        ],
      },
    ],
    badge: { label: "Empleado", color: "bg-sky-500/15 text-sky-300 border-sky-500/25" },
  },
};

/* ── Avatar ── */
const Avatar = ({ nombre }) => {
  const initials = (nombre || "?").split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500/30 to-amber-600/20 border border-orange-500/20 flex items-center justify-center shrink-0">
      <span className="text-xs font-bold text-orange-300">{initials}</span>
    </div>
  );
};

/* ── Sidebar ── */
export const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout, user } = useAuthStore();
  const navigate   = useNavigate();
  const location   = useLocation();

  const rolKey   = (user?.rol || "").toUpperCase();
  const config   = NAV[rolKey] || { sections: [], badge: { label: rolKey, color: "bg-white/10 text-white/40 border-white/10" } };
  const sections = config.sections;
  const badge    = config.badge;

  const handleLogout = () => { logout(); navigate("/login"); };
  const handleNav    = (path) => { if (path === "#") return; navigate(path); setMobileOpen(false); };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">

      {/* ── Logo ── */}
      <div className="px-5 pt-6 pb-5 shrink-0">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-orange-500/15 border border-orange-500/25 flex items-center justify-center shrink-0">
            <FaFire className="text-orange-400 text-sm" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-bold text-[#f5f0eb] leading-tight" style={{ fontFamily: "Georgia, serif" }}>
              Brasas OS
            </h1>
            <p className="text-[10px] text-white/25 font-mono tracking-wider">v2.0</p>
          </div>
          <button onClick={() => setMobileOpen(false)}
            className="lg:hidden w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white/70 transition-colors">
            <FaTimes className="text-xs" />
          </button>
        </div>

        {/* Role badge */}
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-semibold tracking-wider uppercase ${badge.color}`}>
          <div className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
          {badge.label}
        </div>
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 px-3 pb-3 overflow-y-auto space-y-5">
        {sections.map((section) => (
          <div key={section.label}>
            <p className="text-[9px] font-semibold tracking-[0.15em] uppercase text-white/20 px-3 mb-1.5">
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon     = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <button key={item.path} onClick={() => handleNav(item.path)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 text-left group relative
                      ${isActive
                        ? "bg-orange-500/10 text-orange-400"
                        : "text-white/40 hover:text-white/75 hover:bg-white/[0.04]"
                      }`}>
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-orange-500 rounded-r-full" />
                    )}
                    <Icon className={`text-base shrink-0 ${isActive ? "text-orange-400" : "text-white/25 group-hover:text-white/50"}`} />
                    <span className="font-medium text-[13px]">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ── User / Logout ── */}
      <div className="px-3 pb-5 pt-3 border-t border-white/[0.05] shrink-0 space-y-1">
        {user && (
          <div className="flex items-center gap-3 px-3 py-2.5 mb-1">
            <Avatar nombre={user.nombre} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white/80 truncate">{user.nombre || "Usuario"}</p>
              <p className="text-[10px] text-white/30 truncate">{user.email || ""}</p>
            </div>
          </div>
        )}
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/35 hover:text-red-400 hover:bg-red-500/5 transition-all duration-150 group">
          <FaSignOutAlt className="text-base shrink-0 group-hover:text-red-400 transition-colors" />
          <span className="font-medium text-[13px]">Cerrar sesión</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 w-10 h-10 bg-[#111] border border-white/[0.08] rounded-xl flex items-center justify-center text-white/60 hover:text-white transition-all lg:hidden shadow-lg">
        {mobileOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-[240px] h-screen
        bg-[#0b0b0a] border-r border-white/[0.06]
        transition-transform duration-300 ease-out
        ${mobileOpen ? "translate-x-0 shadow-2xl shadow-black/60" : "-translate-x-full lg:translate-x-0"}
      `}>
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)} />
      )}
    </>
  );
};
