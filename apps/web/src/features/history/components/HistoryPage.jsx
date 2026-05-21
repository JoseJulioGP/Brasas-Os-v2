import { useEffect } from "react";
import { FaHistory, FaBox } from "react-icons/fa";
import { useHistoryStore } from "../stores/useHistoryStore";
import { HistoryFilters } from "./HistoryFilters";
import { HistoryCard } from "./HistoryCard";

export const HistoryPage = () => {
  const { orders, isLoading, error, filters, setFilters, fetchHistory } = useHistoryStore();

  useEffect(() => { fetchHistory(); }, []);

  const filtered = orders.filter((o) => {
    const matchSearch = !filters.search || o.id?.toLowerCase().includes(filters.search.toLowerCase());
    const matchEstado = !filters.estado || o.estado === filters.estado;
    return matchSearch && matchEstado;
  });

  return (
    <div className="min-h-screen relative p-4 md:p-8">
      <div className="absolute inset-0 bg-noise pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-radial from-amber-900/10 via-transparent to-transparent animate-gradient-shift pointer-events-none" />
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-orange-600/3 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center gap-4 mb-8 animate-fade-in-up opacity-0">
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <FaHistory className="text-xl text-orange-400" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-[#f5f0eb]">Historial</h1>
            <p className="text-sm text-white/40 font-body">Registro completo de pedidos</p>
          </div>
        </div>

        <HistoryFilters search={filters.search} onSearchChange={(v) => setFilters({ search: v })} estado={filters.estado} onEstadoChange={(v) => setFilters({ estado: v })} />

        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 font-body">{error}</div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="relative">
              <div className="w-12 h-12 border-2 border-orange-500/20 rounded-full" />
              <div className="absolute inset-0 w-12 h-12 border-2 border-transparent border-t-orange-500 rounded-full animate-spin" />
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass rounded-2xl p-16 text-center">
            <FaBox className="text-5xl text-white/10 mx-auto mb-4" />
            <p className="text-white/40 font-body text-lg">No hay pedidos registrados</p>
            <p className="text-white/20 text-sm font-body mt-1">Los pedidos aparecerán aquí una vez creados</p>
          </div>
        ) : (
          <div className="space-y-3 animate-fade-in-up opacity-0 stagger-2">
            {filtered.map((order) => (
              <HistoryCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
