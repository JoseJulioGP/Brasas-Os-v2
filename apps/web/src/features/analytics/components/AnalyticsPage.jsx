import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaChartLine, FaUtensils, FaArrowRight, FaPercentage,
  FaMoneyBillWave, FaFire,
} from "react-icons/fa";
import { MdPayment } from "react-icons/md";
import { useAnalyticsStore } from "../stores/useAnalyticsStore";
import { ResumenCards } from "./ResumenCards";
import { MargenTable, MargenMobileList } from "./MargenTable";
import { RentablesList, AlertasList, NoRentablesList } from "./AnalyticsSidebar";
import { VentasLineChart } from "./VentasLineChart";
import { IngresoCostoBarChart } from "./IngresoCostoBarChart";

const PERIODOS = [
  { value: "diario",  label: "Hoy" },
  { value: "semanal", label: "Esta semana" },
  { value: "mensual", label: "Este mes" },
];

const fmt = (v) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency", currency: "COP", maximumFractionDigits: 0,
  }).format(v || 0);

export const AnalyticsPage = () => {
  const navigate = useNavigate();
  const [periodo, setPeriodo] = useState("mensual");

  const {
    productos, proyecciones, resumen, pagos, topProductos,
    isLoading, error,
    fetchMargenes, fetchProyecciones, fetchResumen, fetchPagos,
    fetchTopProductos, clearError,
  } = useAnalyticsStore();

  // Carga inicial de proyecciones y márgenes (no dependen del período)
  useEffect(() => {
    fetchMargenes();
    fetchProyecciones();
  }, []);

  // Recarga cuando cambia el período
  useEffect(() => {
    fetchResumen(periodo);
    fetchPagos(periodo);
    fetchTopProductos(periodo);
  }, [periodo]);

  return (
    <div className="min-h-screen relative p-4 md:p-8">
      <div className="absolute inset-0 bg-noise pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-radial from-amber-900/10 via-transparent to-transparent animate-gradient-shift pointer-events-none" />
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-orange-600/3 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 animate-fade-in-up opacity-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <FaChartLine className="text-xl text-orange-400" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-[#f5f0eb]">
                Análisis de Rentabilidad
              </h1>
              <p className="text-sm text-white/40 font-body">Márgenes, costos y productos estrella</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/menu")}
            className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 text-white rounded-xl font-semibold text-sm hover:bg-orange-500 transition-all shadow-lg shadow-orange-600/20 font-body"
          >
            <FaUtensils /> Ir al Menú <FaArrowRight className="text-xs" />
          </button>
        </div>

        {/* Selector de período */}
        <div className="flex items-center gap-2 mb-6">
          {PERIODOS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriodo(p.value)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold font-body transition-all ${
                periodo === p.value
                  ? "bg-orange-600 text-white shadow-lg shadow-orange-600/20"
                  : "bg-white/[0.04] text-white/50 border border-white/[0.06] hover:bg-white/[0.07] hover:text-white/70"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Tarjetas de resumen */}
        <ResumenCards
          totalProductos={productos.length}
          resumen={resumen}
        />

        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 font-body flex justify-between items-center">
            <span>{error}</span>
            <button onClick={clearError} className="text-red-400 hover:text-red-300 ml-4">&times;</button>
          </div>
        )}

        {/* Métodos de pago + Top productos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 animate-fade-in-up opacity-0 stagger-2">

          {/* Métodos de pago */}
          {pagos && (
            <div className="glass rounded-2xl p-5">
              <h3 className="text-base font-heading font-bold text-[#f5f0eb] mb-1">
                Cómo te pagaron
              </h3>
              <p className="text-xs text-white/40 font-body mb-4">
                Total recaudado:{" "}
                <span className="text-[#f5f0eb] font-mono font-semibold">
                  {fmt(pagos.total_general)}
                </span>
              </p>
              <div className="grid grid-cols-2 gap-3">
                {/* Efectivo */}
                <div className="flex items-center gap-3 bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-3 py-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <FaMoneyBillWave className="text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 font-body">Efectivo</p>
                    <p className="text-base font-bold font-number text-emerald-400">
                      {fmt(pagos.total_efectivo)}
                    </p>
                    {pagos.total_general > 0 && (
                      <p className="text-[10px] text-white/25 font-body">
                        {((pagos.total_efectivo / pagos.total_general) * 100).toFixed(0)}%
                      </p>
                    )}
                  </div>
                </div>
                {/* Transferencia */}
                <div className="flex items-center gap-3 bg-blue-500/5 border border-blue-500/15 rounded-xl px-3 py-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                    <MdPayment className="text-blue-400 text-lg" />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 font-body">Transferencia</p>
                    <p className="text-base font-bold font-number text-blue-400">
                      {fmt(pagos.total_transferencia)}
                    </p>
                    {pagos.total_general > 0 && (
                      <p className="text-[10px] text-white/25 font-body">
                        {((pagos.total_transferencia / pagos.total_general) * 100).toFixed(0)}%
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Top productos más vendidos */}
          <div className="glass rounded-2xl p-5">
            <h3 className="text-base font-heading font-bold text-[#f5f0eb] mb-1 flex items-center gap-2">
              <FaFire className="text-orange-400 text-sm" />
              Lo que más vendiste
            </h3>
            <p className="text-xs text-white/40 font-body mb-4">
              Productos con más unidades completadas
            </p>
            {topProductos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-2xl mb-2">🍖</p>
                <p className="text-sm text-white/30 font-body">Sin ventas en este período</p>
              </div>
            ) : (
              <div className="space-y-2">
                {topProductos.map((p, i) => {
                  const maxCantidad = topProductos[0]?.cantidad_vendida || 1;
                  const pct = (p.cantidad_vendida / maxCantidad) * 100;
                  return (
                    <div key={p.id || i} className="flex items-center gap-3">
                      <span className="text-xs font-number text-white/20 w-4 shrink-0">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-[#f5f0eb] font-body truncate">{p.nombre}</span>
                          <div className="flex items-center gap-2 shrink-0 ml-2">
                            <span className="text-xs font-number text-orange-400 font-semibold">
                              ×{p.cantidad_vendida}
                            </span>
                            <span className="text-[10px] text-white/25 font-number">
                              {fmt(p.total_generado)}
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-white/[0.04] rounded-full h-1">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-orange-500 to-orange-400"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Gráficos de proyecciones */}
        {proyecciones && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 animate-fade-in-up opacity-0 stagger-2">
            <VentasLineChart meses={proyecciones.meses} />
            <IngresoCostoBarChart meses={proyecciones.meses} />
          </div>
        )}

        {/* Tabla de márgenes por producto */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="relative">
              <div className="w-12 h-12 border-2 border-orange-500/20 rounded-full" />
              <div className="absolute inset-0 w-12 h-12 border-2 border-transparent border-t-orange-500 rounded-full animate-spin" />
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6 animate-fade-in-up opacity-0 stagger-3">
            <div className="lg:col-span-2">
              <div className="glass rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-white/[0.06]">
                  <h3 className="text-lg font-heading font-bold text-[#f5f0eb] flex items-center gap-2">
                    <FaPercentage className="text-orange-400 text-sm" />
                    Margen por producto
                  </h3>
                  <p className="text-xs text-white/35 font-body mt-1">
                    Margen = (precio − costo de producción) ÷ precio × 100
                  </p>
                </div>
                {productos.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-white/30 font-body text-sm">No hay productos en el menú</p>
                    <button
                      onClick={() => navigate("/menu")}
                      className="mt-3 text-orange-400 text-sm font-medium font-body hover:underline"
                    >
                      Agregar productos
                    </button>
                  </div>
                ) : (
                  <>
                    <MargenTable productos={productos} />
                    <MargenMobileList productos={productos} />
                  </>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <RentablesList productos={productos} />
              <AlertasList productos={productos} />
              <NoRentablesList productos={productos} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
