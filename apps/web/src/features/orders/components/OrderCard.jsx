import { FaBox } from "react-icons/fa";
import { StatusBadge } from "./StatusBadge";
import { useMenuStore } from "../../menu/stores/useMenuStore";

export const OrderCard = ({ order, onStatusChange, onCancel }) => {
  const { items: menuItems } = useMenuStore();

  const getItemName = (id) => {
    if (!id) return "Producto";
    const found = menuItems.find((m) => m.id === id);
    return found?.nombre || id?.slice(0, 8) || "Producto";
  };

  const getTotalCost = (order) => {
    if (!order.items) return 0;
    return order.items.reduce((sum, item) => {
      const menuItem = menuItems.find((m) => m.id === item.producto_id);
      return sum + (menuItem?.costo_produccion || 0) * (item.cantidad || 1);
    }, 0);
  };

  const totalCost = getTotalCost(order);
  const margen = order.total - totalCost;
  const margenPct = order.total > 0 ? (margen / order.total) * 100 : 0;

  const nextState = (current) => {
    switch (current) {
      case "PENDIENTE": return { next: "EN_PROCESO", label: "Iniciar" };
      case "EN_PROCESO": return { next: "COMPLETADO", label: "Completar" };
      default: return null;
    }
  };
  const next = nextState(order.estado);

  return (
    <div className="glass rounded-2xl p-5 glass-hover">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
            <FaBox className="text-white/30 text-sm" />
          </div>
          <div>
            <p className="text-[#f5f0eb] font-medium font-body text-sm">
              Pedido <span className="font-number text-orange-400">#{order.id?.slice(0, 8) || order.id}</span>
            </p>
            <p className="text-xs text-white/30 font-body mt-0.5">
              {new Date(order.fecha).toLocaleString("es-CO", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        </div>
        <StatusBadge estado={order.estado} />
      </div>

      {order.items?.length > 0 && (
        <div className="space-y-1.5 mb-4">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <span className="text-white/60 font-body">{item.producto_nombre || getItemName(item.producto_id)}</span>
              <span className="text-white/40 font-number">x{item.cantidad}</span>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-1.5 pt-4 border-t border-white/[0.04]">
        <div className="flex justify-between text-sm">
          <span className="text-white/40 font-body">Total venta</span>
          <span className="font-number font-bold text-lg text-[#f5f0eb]">${order.total?.toLocaleString() || "0"}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-white/30 font-body">Costo estimado</span>
          <span className="font-number text-white/40">${Math.round(totalCost).toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm pt-1 border-t border-white/[0.04]">
          <span className="text-white/40 font-body">Margen estimado</span>
          <span className={`font-number font-medium ${margen > 0 ? "text-emerald-400" : "text-red-400"}`}>
            ${Math.round(margen).toLocaleString()} ({margenPct.toFixed(0)}%)
          </span>
        </div>
      </div>

      {order.usuario_nombre && (
        <p className="text-xs text-white/30 font-body mt-3 pt-3 border-t border-white/[0.04]">
          <span className="text-white/40">Por: </span>{order.usuario_nombre}
        </p>
      )}

      <div className="flex gap-2 mt-4 pt-4 border-t border-white/[0.04]">
        {next && (
          <button onClick={() => onStatusChange(order.id, next.next)}
            className="flex-1 py-2 bg-blue-600/10 text-blue-400 rounded-xl text-sm font-medium hover:bg-blue-600/20 transition-all font-body">
            {next.label}
          </button>
        )}
        {onCancel && (order.estado === "PENDIENTE" || order.estado === "EN_PROCESO") && (
          <button onClick={() => onCancel(order.id)}
            className="flex-1 py-2 bg-red-600/10 text-red-400 rounded-xl text-sm font-medium hover:bg-red-600/20 transition-all font-body">
            Cancelar
          </button>
        )}
      </div>
    </div>
  );
};
