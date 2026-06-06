import { create } from "zustand";
import {
  fetchFinancialSummary,
  fetchStats,
  fetchInventory,
  fetchActionHistory,
  fetchTopProducts,
} from "../services/dashboardService";

const useDashboardStore = create((set, get) => ({
  periodo:       "dia",
  stats:         null,
  financial:     null,
  inventory:     [],
  actionHistory: [],
  topProducts:   [],

  // Loading granular por sección
  loading: {
    financial:  true,
    stats:      true,
    inventory:  true,
    history:    true,
    products:   true,
  },
  error: null,

  // Compatibilidad
  get isLoading() {
    const l = get().loading;
    return Object.values(l).some(Boolean);
  },

  setPeriodo: (periodo) => set({ periodo }),

  fetchData: async () => {
    const { periodo } = get();

    // Reset loading
    set({
      loading: { financial: true, stats: true, inventory: true, history: true, products: true },
      error: null,
    });

    // Lanzar todo en paralelo pero actualizar el store apenas llega cada uno
    const run = async (key, fn) => {
      try {
        const value = await fn();
        set((s) => ({ ...s, loading: { ...s.loading, [key]: false }, [key]: value ?? s[key] }));
      } catch {
        set((s) => ({ ...s, loading: { ...s.loading, [key]: false } }));
      }
    };

    // Inventario se comparte entre stats e inventory — se llama una sola vez
    const inventoryPromise = fetchInventory();

    await Promise.allSettled([
      // Financiero
      run("financial", () => fetchFinancialSummary(periodo)),

      // Stats: depende del inventario ya pedido
      (async () => {
        try {
          const [statsData, invData] = await Promise.allSettled([
            fetchStats(periodo),
            inventoryPromise,
          ]);
          const s = statsData.status === "fulfilled" ? statsData.value : null;
          const i = invData.status  === "fulfilled" ? invData.value  : [];
          set((prev) => ({
            stats:    s ?? prev.stats,
            inventory: i,
            loading:  { ...prev.loading, stats: false, inventory: false },
          }));
        } catch {
          set((s) => ({ ...s, loading: { ...s.loading, stats: false, inventory: false } }));
        }
      })(),

      // Historial
      run("actionHistory", fetchActionHistory),

      // Top productos
      run("topProducts", fetchTopProducts),
    ]);
  },

  clearError: () => set({ error: null }),
}));

export default useDashboardStore;
