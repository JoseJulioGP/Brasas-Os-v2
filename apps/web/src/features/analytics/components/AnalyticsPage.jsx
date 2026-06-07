import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaChartLine, FaUtensils, FaArrowRight, FaPercentage } from "react-icons/fa";
import { useAnalyticsStore } from "../stores/useAnalyticsStore";
import { ResumenCards } from "./ResumenCards";
import { MargenTable, MargenMobileList } from "./MargenTable";
import { RentablesList, AlertasList, NoRentablesList } from "./AnalyticsSidebar";
import { VentasLineChart } from "./VentasLineChart";
import { IngresoCostoBarChart } from "./IngresoCostoBarChart";

export const AnalyticsPage = () => {
  const navigate = useNavigate();
  const {
    productos, proyecciones,
    isLoading, error,
    fetchMargenes, fetchProyecciones, clearError,
  } = useAnalyticsStore();

  useEffect(() => {
    fetchMargenes();
    fetchProyecciones();
  }, []);

  // Datos para las tarjetas: proyecciones del backend tienen prioridad.
  // Fallback al cálculo local (ya parseado a float en el store) si la petición falla.
  const totalIngresos  = proyecciones?.resumen.ingreso_total_potencial
    ?? productos.reduce((s, p) => s + (p.precio_venta || 0), 0);
  const totalCostos    = proyecciones?.resumen.costo_total_produccion
    ?? productos.reduce((s, p) => s + (p.costo_produccion || 0), 0);
  const margenPromedio = proyecciones?.resumen.margen_promedio_pct
    ?? (totalIngresos > 0 ? ((totalIngresos - totalCostos) / totalIngresos) * 100 : 0);

  return (
    <div className="min-h-screen relative p-4 md:p-8">
      <div className="absolute inset-0 bg-noise pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-radial from-amber-900/10 via-transparent to-transparent animate-gradient-shift pointer-events-none" />
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-orange-600/3 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 animate-fade-in-up opacity-0">
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

        {/* Tarjetas de resumen */}
        <ResumenCards
          totalProductos={productos.length}
          totalIngresos={totalIngresos}
          totalCostos={totalCostos}
          margenPromedio={margenPromedio}
        />

        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 font-body flex justify-between items-center">
            <span>{error}</span>
            <button onClick={clearError} className="text-red-400 hover:text-red-300 ml-4">&times;</button>
          </div>
        )}

        {/* Gráficos de proyecciones */}
        {proyecciones && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 animate-fade-in-up opacity-0 stagger-2">
            <VentasLineChart meses={proyecciones.meses} />
            <IngresoCostoBarChart meses={proyecciones.meses} />
          </div>
        )}

        {/* Tabla de márgenes por plato */}
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
                    Márgenes por plato
                  </h3>
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
