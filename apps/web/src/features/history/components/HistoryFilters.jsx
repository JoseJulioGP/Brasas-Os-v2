<<<<<<< HEAD
import { FaSearch } from "react-icons/fa";

export const HistoryFilters = ({ search, onSearchChange, estado, onEstadoChange }) => (
  <div className="glass rounded-2xl p-4 mb-6 animate-fade-in-up opacity-0 stagger-1">
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1 relative">
        <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20 text-sm" />
        <input type="text" placeholder="Buscar por ID de pedido..." value={search} onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#f5f0eb] placeholder:text-white/20 focus:outline-none focus:border-orange-500/30 transition-colors font-body" />
      </div>
      <select value={estado} onChange={(e) => onEstadoChange(e.target.value)}
        className="bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white/70 focus:outline-none focus:border-orange-500/30 transition-colors font-body"
      >
        <option value="">Todos los estados</option>
        <option value="PENDIENTE">Pendiente</option>
        <option value="EN_PROCESO">En Proceso</option>
        <option value="COMPLETADO">Completado</option>
        <option value="CANCELADO">Cancelado</option>
      </select>
    </div>
  </div>
);
=======
import { TIPOS_ACCION } from "../config/historyViewConfig";

const inputClass =
  "bg-white/[0.04] border border-white/[0.06] rounded-xl px-3 py-2 text-sm text-white/70 placeholder:text-white/20 focus:outline-none focus:border-orange-500/30 transition-colors font-body w-full";

export const HistoryFilters = ({ config, filtros, onChange, usuarios = [] }) => {
  const { filters, entidades } = config;

  const handle = (key) => (e) => onChange({ [key]: e.target.value });

  return (
    <div className="glass rounded-2xl p-4 mb-6 animate-fade-in-up opacity-0 stagger-1">
      <div className="flex flex-wrap gap-3">

        {filters.includes("usuario_id") && (
          <div className="flex-1 min-w-[160px]">
            {usuarios.length > 0 ? (
              <select value={filtros.usuario_id || ""} onChange={handle("usuario_id")} className={inputClass}>
                <option value="">Todos los usuarios</option>
                {usuarios.map((u) => (
                  <option key={u.id} value={u.id}>{u.nombre}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                placeholder="ID de usuario"
                value={filtros.usuario_id || ""}
                onChange={handle("usuario_id")}
                className={inputClass}
              />
            )}
          </div>
        )}

        {filters.includes("rol") && (
          <div className="flex-1 min-w-[130px]">
            <select value={filtros.rol || ""} onChange={handle("rol")} className={inputClass}>
              <option value="">Todos los roles</option>
              <option value="ADMIN">Admin</option>
              <option value="JEFE">Jefe</option>
              <option value="EMPLEADO">Empleado</option>
            </select>
          </div>
        )}

        {filters.includes("tipo_accion") && (
          <div className="flex-1 min-w-[130px]">
            <select value={filtros.tipo_accion || ""} onChange={handle("tipo_accion")} className={inputClass}>
              <option value="">Todas las acciones</option>
              {TIPOS_ACCION.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        )}

        {filters.includes("entidad") && entidades.length > 0 && (
          <div className="flex-1 min-w-[130px]">
            <select value={filtros.entidad || ""} onChange={handle("entidad")} className={inputClass}>
              <option value="">Todas las entidades</option>
              {entidades.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </div>
        )}

        {filters.includes("fecha_inicio") && (
          <div className="flex-1 min-w-[140px]">
            <input
              type="date"
              value={filtros.fecha_inicio || ""}
              onChange={handle("fecha_inicio")}
              className={inputClass}
            />
          </div>
        )}

        {filters.includes("fecha_fin") && (
          <div className="flex-1 min-w-[140px]">
            <input
              type="date"
              value={filtros.fecha_fin || ""}
              onChange={handle("fecha_fin")}
              className={inputClass}
            />
          </div>
        )}

      </div>
    </div>
  );
};
>>>>>>> 47bba80be1627d21fba2a8195396ca4b89bcaebf
