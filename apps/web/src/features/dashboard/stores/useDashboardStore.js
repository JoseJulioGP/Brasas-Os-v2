import { create } from "zustand";
import { 
  fetchDashboardData, 
  fetchStats, 
  fetchFinancialSummary, 
  fetchInventory, 
  fetchActionHistory,
  fetchTopProducts 
} from "../services/dashboardService";

const useDashboardStore = create((set, get) => ({
  // Estado
  periodo: "dia",
  stats: null,
  financial: null,
  inventory: [],
  actionHistory: [],
  topProducts: [],
  isLoading: false,
  error: null,

  // Cambiar periodo
  setPeriodo: (periodo) => {
    set({ periodo });
    get().fetchAll();
  },

  // Obtener todos los datos del dashboard
  fetchAll: async () => {
    const { periodo } = get();
    set({ isLoading: true, error: null });
    
    try {
      // Ejecutar todas las llamadas en paralelo
      const [dashboardData, stats, financial, inventory, actionHistory, topProducts] = await Promise.allSettled([
        fetchDashboardData(periodo),
        fetchStats(periodo),
        fetchFinancialSummary(periodo),
        fetchInventory(),
        fetchActionHistory(),
        fetchTopProducts()
      ]);

      // Procesar resultados
      const statsValue = stats.status === 'fulfilled' ? stats.value : null;
      const financialValue = financial.status === 'fulfilled' ? financial.value : null;
      const inventoryValue = inventory.status === 'fulfilled' ? inventory.value : [];
      const historyValue = actionHistory.status === 'fulfilled' ? actionHistory.value : [];
      const productsValue = topProducts.status === 'fulfilled' ? topProducts.value : [];
      
      // Usar datos del dashboard como base
      const dashboardValue = dashboardData.status === 'fulfilled' ? dashboardData.value : {};

      set({
        stats: statsValue || { 
          [periodo]: dashboardValue 
        },
        financial: financialValue || { 
          [periodo]: { ingresos: dashboardValue.ingresos || 0, costos: 0, ganancia: 0, margen: 0 } 
        },
        inventory: inventoryValue,
        actionHistory: historyValue,
        topProducts: productsValue,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  // Obtener solo stats (alias para compatibilidad)
  fetchStats: async () => {
    const { periodo } = get();
    try {
      const stats = await fetchStats(periodo);
      set({ stats });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  },

  // Obtener solo inventario
  fetchInventory: async () => {
    try {
      const inventory = await fetchInventory();
      set({ inventory });
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  },

  // Obtener solo historial
  fetchHistory: async () => {
    try {
      const actionHistory = await fetchActionHistory();
      set({ actionHistory });
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  },

  // Limpiar error
  clearError: () => set({ error: null })
}));

export default useDashboardStore;