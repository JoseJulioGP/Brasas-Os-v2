import { useEffect, useState } from "react";
import { FaHistory } from "react-icons/fa";
import { useAuthStore } from "../../auth/stores/useAuthStore";
import { useHistoryStore } from "../stores/useHistoryStore";
import { historyViewConfig } from "../config/historyViewConfig";
import { HistoryFilters } from "./HistoryFilters";
import { HistoryTable } from "./HistoryTable";
import { HistoryMobileList } from "./HistoryMobileList";
import { Pagination } from "./Pagination";
import { usersService } from "../../users/services/usersService";
import { ErrorAlert } from "../../auth/components/ErrorAlert";

export const HistoryPage = () => {
  const user = useAuthStore((s) => s.user);
  const { items, total, page, limit, filtros, isLoading, error, fetchHistorial, setFiltros, setPage, reset } =
    useHistoryStore();

  const rol = user?.rol?.toUpperCase();
  const config = historyViewConfig[rol] || historyViewConfig.EMPLEADO;
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    reset();
    fetchHistorial();
    if (rol === "ADMIN") {
      usersService.getUsers().then((data) => setUsuarios(data?.data ?? data ?? [])).catch(() => {});
    }
  }, [user?.rol]);

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
            <p className="text-sm text-white/40 font-body">
              {rol === "ADMIN" && "Historial técnico global"}
              {rol === "JEFE" && "Historial operativo del negocio"}
              {rol === "EMPLEADO" && "Tus acciones registradas"}
            </p>
          </div>
        </div>

        <HistoryFilters
          config={config}
          filtros={filtros}
          onChange={setFiltros}
          usuarios={usuarios}
        />

        {error && <ErrorAlert error={error} />}

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="relative">
              <div className="w-12 h-12 border-2 border-orange-500/20 rounded-full" />
              <div className="absolute inset-0 w-12 h-12 border-2 border-transparent border-t-orange-500 rounded-full animate-spin" />
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="glass rounded-2xl p-16 text-center">
            <FaHistory className="text-5xl text-white/10 mx-auto mb-4" />
            <p className="text-white/40 font-body text-lg">{config.emptyMessage}</p>
          </div>
        ) : (
          <>
            <HistoryTable items={items} columns={config.columns} />
            <HistoryMobileList items={items} columns={config.columns} />
            <Pagination page={page} limit={limit} total={total} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
};
