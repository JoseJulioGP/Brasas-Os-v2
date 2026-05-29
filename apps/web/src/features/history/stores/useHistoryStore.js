import { create } from "zustand";
import { historyService } from "../services/historyService";

let debounceTimer = null;

export const useHistoryStore = create((set, get) => ({
  items:     [],
  total:     0,
  page:      1,
  limit:     20,
  filtros:   {},
  isLoading: false,
  error:     null,

  fetchHistorial: async () => {
    const { page, limit, filtros } = get();
    set({ isLoading: true, error: null });
    try {
      const data = await historyService.getHistorial({ ...filtros, page, limit });
      set({ items: data.data ?? [], total: data.total ?? 0, isLoading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Error al cargar historial",
        isLoading: false,
      });
    }
  },

  setFiltros: (nuevos) => {
    set({ filtros: { ...get().filtros, ...nuevos }, page: 1 });
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => get().fetchHistorial(), 400);
  },

  setPage: (page) => {
    set({ page });
    get().fetchHistorial();
  },

  reset: () => set({ items: [], total: 0, page: 1, filtros: {}, error: null }),
}));
