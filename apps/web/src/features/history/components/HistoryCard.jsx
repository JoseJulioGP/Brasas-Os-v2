import { ActionBadge } from "./ActionBadge";
import { FaHistory } from "react-icons/fa";

const fmt = (fecha) =>
  new Date(fecha).toLocaleString("es-CO", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

export const HistoryCard = ({ item, columns }) => (
  <div className="glass rounded-2xl p-4 glass-hover">
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0">
        <FaHistory className="text-white/30 text-xs" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <ActionBadge tipo={item.accion} />
          {item.entidad && (
            <span className="text-xs text-white/30 bg-white/[0.04] px-2 py-0.5 rounded-full font-body border border-white/[0.06]">
              {item.entidad}
            </span>
          )}
          {item.entidad_id && (
            <span className="text-xs text-white/20 font-number">#{item.entidad_id.slice(0, 8)}</span>
          )}
        </div>

        {item.detalle?.descripcion && (
          <p className="text-sm text-white/60 font-body truncate">{item.detalle.descripcion}</p>
        )}

        <div className="flex flex-wrap items-center gap-3 mt-2">
          {columns?.includes("usuario") && item.usuario_nombre && (
            <span className="text-xs text-white/30 font-body">
              Por: <span className="text-white/50">{item.usuario_nombre}</span>
            </span>
          )}
          <span className="text-xs text-white/20 font-number ml-auto">{fmt(item.created_at)}</span>
        </div>
      </div>
    </div>
  </div>
);
