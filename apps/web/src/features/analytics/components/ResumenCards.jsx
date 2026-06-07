import { FaUtensils, FaArrowUp, FaArrowDown, FaReceipt, FaTicketAlt } from "react-icons/fa";

const fmt = (v) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency", currency: "COP", maximumFractionDigits: 0,
  }).format(v || 0);

export const ResumenCards = ({ totalProductos, resumen }) => {
  const ingresos         = resumen?.ingresos         ?? 0;
  const utilidad         = resumen?.utilidad         ?? 0;
  const margen           = resumen?.margen           ?? 0;
  const cantidad_pedidos = resumen?.cantidad_pedidos ?? 0;
  const ticket_promedio  = resumen?.ticket_promedio  ?? 0;
  const varUtil          = resumen?.periodo_anterior?.variacion_utilidad ?? null;

  const margenColor = margen > 30 ? "text-emerald-400" : margen > 15 ? "text-amber-400" : "text-red-400";
  const utilColor   = utilidad >= 0 ? "text-emerald-400" : "text-red-400";

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6 animate-fade-in-up opacity-0 stagger-1">

      {/* Productos en carta */}
      <div className="glass rounded-2xl p-4 xl:p-5">
        <p className="text-[10px] text-white/40 font-body uppercase tracking-wider mb-1">Productos</p>
        <p className="text-2xl font-bold font-number text-[#f5f0eb]">{totalProductos}</p>
        <p className="text-[10px] text-white/25 font-body mt-1">en carta</p>
      </div>

      {/* Pedidos completados */}
      <div className="glass rounded-2xl p-4 xl:p-5">
        <p className="text-[10px] text-white/40 font-body uppercase tracking-wider mb-1">Pedidos</p>
        <p className="text-2xl font-bold font-number text-orange-400">{cantidad_pedidos}</p>
        <p className="text-[10px] text-white/25 font-body mt-1">completados</p>
      </div>

      {/* Ticket promedio */}
      <div className="glass rounded-2xl p-4 xl:p-5">
        <p className="text-[10px] text-white/40 font-body uppercase tracking-wider mb-1">Ticket prom.</p>
        <p className="text-lg font-bold font-number text-[#f5f0eb]">{fmt(ticket_promedio)}</p>
        <p className="text-[10px] text-white/25 font-body mt-1">por pedido</p>
      </div>

      {/* Lo que vendiste */}
      <div className="glass rounded-2xl p-4 xl:p-5">
        <p className="text-[10px] text-white/40 font-body uppercase tracking-wider mb-1">Vendido</p>
        <p className="text-lg font-bold font-number text-emerald-400">{fmt(ingresos)}</p>
        <p className="text-[10px] text-white/25 font-body mt-1">pedidos completados</p>
      </div>

      {/* Ganancia neta */}
      <div className="glass rounded-2xl p-4 xl:p-5">
        <p className="text-[10px] text-white/40 font-body uppercase tracking-wider mb-1">Ganancia neta</p>
        <p className={`text-lg font-bold font-number ${utilColor}`}>{fmt(utilidad)}</p>
        <div className="flex items-center gap-1 mt-1">
          {varUtil !== null ? (
            <span className={`text-[10px] flex items-center gap-0.5 ${varUtil >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {varUtil >= 0 ? <FaArrowUp className="text-[8px]" /> : <FaArrowDown className="text-[8px]" />}
              {Math.abs(varUtil).toFixed(1)}% vs antes
            </span>
          ) : (
            <p className="text-[10px] text-white/25 font-body">ventas − costos</p>
          )}
        </div>
      </div>

      {/* Margen */}
      <div className="glass rounded-2xl p-4 xl:p-5">
        <p className="text-[10px] text-white/40 font-body uppercase tracking-wider mb-1">Margen</p>
        <p className={`text-2xl font-bold font-number ${margenColor}`}>{margen.toFixed(1)}%</p>
        <p className="text-[10px] font-body mt-1">
          {margen > 30
            ? <span className="text-emerald-400">✓ Saludable</span>
            : margen > 15
            ? <span className="text-amber-400">⚠ Revisar costos</span>
            : <span className="text-red-400">✗ Costos altos</span>}
        </p>
      </div>

    </div>
  );
};
