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
                {usuarios.map((u) => <option key={u.id} value={u.id}>{u.nombre}</option>)}
              </select>
            ) : (
              <input type="text" placeholder="ID de usuario" value={filtros.usuario_id || ""} onChange={handle("usuario_id")} className={inputClass} />
            )}
          </div>
        )}

        {filters.includes("accion") && (
          <div className="flex-1 min-w-[130px]">
            <select value={filtros.accion || ""} onChange={handle("accion")} className={inputClass}>
              <option value="">Todas las acciones</option>
              {TIPOS_ACCION.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        )}

        {filters.includes("entidad") && entidades?.length > 0 && (
          <div className="flex-1 min-w-[130px]">
            <select value={filtros.entidad || ""} onChange={handle("entidad")} className={inputClass}>
              <option value="">Todas las entidades</option>
              {entidades.map((e) => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
        )}

        {filters.includes("fecha_inicio") && (
          <div className="flex-1 min-w-[140px]">
            <input type="date" value={filtros.fecha_inicio || ""} onChange={handle("fecha_inicio")} className={inputClass} />
          </div>
        )}

        {filters.includes("fecha_fin") && (
          <div className="flex-1 min-w-[140px]">
            <input type="date" value={filtros.fecha_fin || ""} onChange={handle("fecha_fin")} className={inputClass} />
          </div>
        )}

      </div>
    </div>
  );
};
