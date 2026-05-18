import { create } from "zustand";
import { historyService } from "../services/historyService";

export const useHistoryStore = create((set, get) => ({
  orders: [],
  isLoading: false,
  error: null,
  filters: { search: "", estado: "", fechaInicio: "", fechaFin: "" },

  setFilters: (filters) => set({ filters: { ...get().filters, ...filters } }),

  fetchHistory: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await historyService.getHistory();
      set({ orders: data.data || data, isLoading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Error al cargar historial",
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
