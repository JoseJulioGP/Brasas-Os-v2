import { ActionBadge } from "./ActionBadge";

const LABELS = {
  id:         "ID Registro",
  usuario:    "Usuario",
  accion:     "Acción",
  entidad:    "Entidad",
  entidad_id: "ID Entidad",
  detalle:    "Descripción",
  created_at: "Fecha",
};

const fmt = (fecha) =>
  new Date(fecha).toLocaleString("es-CO", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

export const HistoryTable = ({ items, columns }) => (
  <div className="hidden md:block animate-fade-in-up opacity-0 stagger-2">
    <div className="glass rounded-2xl overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/[0.06]">
            {columns.map((col) => (
              <th key={col} className="text-left px-5 py-3 text-xs font-medium text-white/30 font-body uppercase tracking-wider">
                {LABELS[col] || col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
              {columns.map((col) => (
                <td key={col} className="px-5 py-3 text-sm font-body">
                  {col === "id"         && <span className="text-xs text-white/30 font-number">{item.id ? item.id.slice(0, 8) : "—"}</span>}
                  {col === "accion"     && <ActionBadge tipo={item.accion} />}
                  {col === "usuario"    && <span className="text-white/70">{item.usuario_nombre || "Sistema"}</span>}
                  {col === "entidad"    && (
                    <span className="text-xs text-white/40 bg-white/[0.04] px-2 py-0.5 rounded-full border border-white/[0.06]">
                      {item.entidad || "—"}
                    </span>
                  )}
                  {col === "entidad_id" && (
                    <span className="text-xs text-white/30 font-number">
                      {item.entidad_id ? `#${item.entidad_id.slice(0, 8)}` : "—"}
                    </span>
                  )}
                  {col === "detalle"    && (
                    <span className="text-white/50 truncate max-w-[200px] block">
                      {item.detalle?.descripcion || (typeof item.detalle === "string" ? item.detalle : "—")}
                    </span>
                  )}
                  {col === "created_at" && <span className="text-white/30 font-number text-xs whitespace-nowrap">{item.created_at ? fmt(item.created_at) : "—"}</span>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
