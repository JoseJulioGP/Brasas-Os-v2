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
  </div>
);
