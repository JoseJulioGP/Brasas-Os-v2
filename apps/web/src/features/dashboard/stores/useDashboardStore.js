import { create } from 'zustand';
import { fetchDashboardData, mockStats } from '../services/dashboardService';

const useDashboardStore = create((set, get) => ({
  periodo: 'dia',
  stats: null,
  financial: null,
  inventory: [],
  actionHistory: [],
  isLoading: false,
  error: null,

  setPeriodo: (periodo) => {
    set({ periodo, stats: mockStats[periodo] });
  },

  fetchData: async () => {
    const { periodo } = get();
    set({ isLoading: true, error: null });
    try {
      const data = await fetchDashboardData(periodo);
      set({
        stats: data.stats,
        financial: data.financial,
        inventory: data.inventory,
        actionHistory: data.actionHistory,
        isLoading: false
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  }
}));

export default useDashboardStore;