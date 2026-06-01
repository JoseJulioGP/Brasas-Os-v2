import { create } from "zustand";
import { historyService } from "../services/historyService";

<<<<<<< HEAD
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
=======
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
>>>>>>> 47bba80be1627d21fba2a8195396ca4b89bcaebf
    } catch (err) {
      set({
        error: err.response?.data?.message || "Error al cargar historial",
        isLoading: false,
      });
    }
  },

<<<<<<< HEAD
  clearError: () => set({ error: null }),
=======
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
>>>>>>> 47bba80be1627d21fba2a8195396ca4b89bcaebf
}));
