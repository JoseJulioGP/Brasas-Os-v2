import { useState } from "react";
import { FaBox, FaMoneyBillWave, FaExchangeAlt } from "react-icons/fa";
import { MdPayment } from "react-icons/md";
import { StatusBadge } from "./StatusBadge";
import { PaymentModal } from "./PaymentModal";
import { useMenuStore } from "../../menu/stores/useMenuStore";

const PAGO_ICONS = {
  efectivo:      { icon: FaMoneyBillWave, label: "Efectivo",      color: "text-emerald-400" },
  transferencia: { icon: MdPayment,       label: "Transferencia", color: "text-blue-400"    },
  ambos:         { icon: FaExchangeAlt,   label: "Ambos",         color: "text-amber-400"   },
};

export const OrderCard = ({ order, onStatusChange, onCancel }) => {
  const { items: menuItems } = useMenuStore();
  const [showPayment, setShowPayment] = useState(false);
  const [pago, setPago] = useState(null);

  const getItemName = (id) => {
    if (!id) return "Producto";
    return menuItems.find(m => m.id === id)?.nombre || id?.slice(0, 8) || "Producto";
  };

  const getTotalCost = () => {
    if (!order.items) return 0;
    return order.items.reduce((sum, item) => {
      const menuItem = menuItems.find(m => m.id === item.producto_id);
      return sum + (menuItem?.costo_produccion || 0) * (item.cantidad || 1);
    }, 0);
  };

  const totalCost = getTotalCost();
  const margen    = order.total - totalCost;
  const margenPct = order.total > 0 ? (margen / order.total) * 100 : 0;

  const isPending   = ["pendiente", "preparando"].includes((order.estado || "").toLowerCase());
  const isCompleted = ["entregado", "completado", "cancelado"].includes((order.estado || "").toLowerCase());

  const handleCompletarClick = () => setShowPayment(true);

  const handlePagoConfirm = (pagoData) => {
    setPago(pagoData);
    setShowPayment(false);
    // Normalizar el pago para el backend
    const pagoBackend = {
      metodo:        pagoData.metodo,
      efectivo:      pagoData.metodo === "ambos" ? pagoData.efectivo : (pagoData.metodo === "efectivo" ? order.total : 0),
      transferencia: pagoData.metodo === "ambos" ? pagoData.transferencia : (pagoData.metodo === "transferencia" ? order.total : 0),
    };
    onStatusChange(order.id, "completado", pagoBackend);
  };

  const PagoInfo = pago && PAGO_ICONS[pago.metodo];

  return (
    <>
      <div className="glass rounded-2xl p-5 glass-hover">

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
              <FaBox className="text-white/30 text-sm" />
            </div>
            <div>
              <p className="text-[#f5f0eb] font-medium text-sm">
                Pedido <span className="font-mono text-orange-400">#{order.id?.slice(0, 8)}</span>
              </p>
              <p className="text-xs text-white/30 mt-0.5">
                {order.created_at && new Date(order.created_at).toLocaleString("es-CO", {
                  day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
                })}
              </p>
            </div>
          </div>
          <StatusBadge estado={order.estado} />
        </div>

        {/* Items */}
        {order.items?.length > 0 && (
          <div className="space-y-1.5 mb-4">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-white/60">{item.producto_nombre || getItemName(item.producto_id)}</span>
                <span className="text-white/35 font-mono">×{item.cantidad}</span>
              </div>
            ))}
          </div>
        )}

        {/* Financiero */}
        <div className="space-y-1.5 pt-4 border-t border-white/[0.04]">
          <div className="flex justify-between text-sm">
            <span className="text-white/40">Total venta</span>
            <span className="font-mono font-bold text-lg text-[#f5f0eb]">
              ${order.total?.toLocaleString("es-CO") || "0"}
            </span>
          </div>
          {totalCost > 0 && (
            <div className="flex justify-between text-xs">
              <span className="text-white/30">Costo estimado</span>
              <span className="font-mono text-white/40">${Math.round(totalCost).toLocaleString("es-CO")}</span>
            </div>
          )}
          {margen !== 0 && (
            <div className="flex justify-between text-sm pt-1 border-t border-white/[0.04]">
              <span className="text-white/40">Margen estimado</span>
              <span className={`font-mono font-medium ${margen > 0 ? "text-emerald-400" : "text-red-400"}`}>
                ${Math.round(margen).toLocaleString("es-CO")} ({margenPct.toFixed(0)}%)
              </span>
            </div>
          )}
        </div>

        {/* Pago registrado */}
        {pago && PagoInfo && (
          <div className={`mt-3 flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.02] border border-white/[0.05] text-xs ${PagoInfo.color}`}>
            <PagoInfo.icon className="text-sm shrink-0" />
            <span className="font-medium">{PagoInfo.label}</span>
            {pago.metodo === "ambos" && (
              <span className="text-white/30 ml-1 font-mono">
                Ef: ${Number(pago.efectivo).toLocaleString("es-CO")} · Tr: ${Number(pago.transferencia).toLocaleString("es-CO")}
              </span>
            )}
          </div>
        )}

        {/* Empleado */}
        {order.empleado_nombre && (
          <p className="text-xs text-white/25 mt-3 pt-3 border-t border-white/[0.04]">
            <span className="text-white/35">Por: </span>{order.empleado_nombre}
          </p>
        )}

        {/* Acciones */}
        {!isCompleted && (
          <div className="flex gap-2 mt-4 pt-4 border-t border-white/[0.04]">
            {isPending && (
              <button onClick={handleCompletarClick}
                className="flex-1 py-2.5 bg-orange-600/15 text-orange-400 border border-orange-500/25 rounded-xl text-sm font-semibold hover:bg-orange-600/25 transition-all">
                Completar
              </button>
            )}
            {onCancel && isPending && (
              <button onClick={() => onCancel(order.id)}
                className="flex-1 py-2.5 bg-red-600/8 text-red-400/70 border border-red-500/15 rounded-xl text-sm font-medium hover:bg-red-600/15 hover:text-red-400 transition-all">
                Cancelar
              </button>
            )}
          </div>
        )}
      </div>

      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        onConfirm={handlePagoConfirm}
        total={order.total || 0}
      />
    </>
  );
};
