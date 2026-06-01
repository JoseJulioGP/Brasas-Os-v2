<<<<<<< HEAD
import { FaBox } from "react-icons/fa";
import { StatusBadge } from "../../orders/components/StatusBadge";

export const HistoryCard = ({ order }) => (
  <div className="group glass rounded-2xl p-5 glass-hover">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0">
          <FaBox className="text-white/30 text-sm" />
        </div>
        <div>
          <p className="text-[#f5f0eb] font-medium font-body">
            Pedido <span className="font-number text-orange-400">#{order.id?.slice(0, 8) || order.id}</span>
          </p>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-white/30 font-body">
              {new Date(order.fecha).toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" })}
            </span>
            <span className="text-white/10">|</span>
            <span className="text-xs text-white/30 font-body">
              {new Date(order.fecha).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
          {order.usuario_nombre && (
            <p className="text-xs text-white/30 font-body mt-1">
              Por: <span className="text-white/50">{order.usuario_nombre}</span>
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {order.total != null && (
          <span className="text-lg font-number font-bold text-[#f5f0eb]">
            ${order.total.toLocaleString()}
          </span>
        )}
        <StatusBadge estado={order.estado} />
      </div>
    </div>

    {order.items?.length > 0 && (
      <div className="mt-4 pt-4 border-t border-white/[0.04]">
        <div className="flex flex-wrap gap-2">
          {order.items.map((item, idx) => (
            <span key={idx} className="px-3 py-1 bg-white/[0.04] rounded-lg text-xs text-white/40 font-body">
              {item.producto_nombre || "Producto"} <span className="text-white/20">x{item.cantidad}</span>
            </span>
          ))}
        </div>
      </div>
    )}
=======
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
          <ActionBadge tipo={item.tipo_accion} />
          {item.entidad && (
            <span className="text-xs text-white/30 bg-white/[0.04] px-2 py-0.5 rounded-full font-body border border-white/[0.06]">
              {item.entidad}
            </span>
          )}
          {item.entidad_id && (
            <span className="text-xs text-white/20 font-number">#{item.entidad_id.slice(0, 8)}</span>
          )}
        </div>

        {item.descripcion && (
          <p className="text-sm text-white/60 font-body truncate">{item.descripcion}</p>
        )}

        <div className="flex flex-wrap items-center gap-3 mt-2">
          {columns.includes("usuario") && item.usuario_nombre && (
            <span className="text-xs text-white/30 font-body">
              Por: <span className="text-white/50">{item.usuario_nombre}</span>
            </span>
          )}
          {columns.includes("rol") && item.rol_nombre && (
            <span className="text-xs text-white/30 font-body">{item.rol_nombre}</span>
          )}
          <span className="text-xs text-white/20 font-number ml-auto">{fmt(item.fecha)}</span>
        </div>
      </div>
    </div>
>>>>>>> 47bba80be1627d21fba2a8195396ca4b89bcaebf
  </div>
);
