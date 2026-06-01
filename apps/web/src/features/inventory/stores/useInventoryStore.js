import { create } from "zustand";
import { inventoryService } from "../services/inventoryService";

const useInventoryStore = create((set, get) => ({
  insumos: [],
  movimientos: [],
  isLoading: false,
  error: null,

  // === INSUMOS ===
  fetchInsumos: async () => {
    set({ isLoading: true, error: null });
    try {
      const insumos = await inventoryService.getInsumos();
      set({ insumos, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, isLoading: false });
    }
  },

  addInsumo: async (item) => {
    set({ isLoading: true, error: null });
    try {
      const newItem = await inventoryService.createInsumo(item);
      set((state) => ({ insumos: [...state.insumos, newItem], isLoading: false }));
      return newItem;
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, isLoading: false });
      throw error;
    }
  },

  updateInsumo: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await inventoryService.updateInsumo(id, data);
      set((state) => ({
        insumos: state.insumos.map((i) => (i.id === id ? updated : i)),
        isLoading: false,
      }));
      return updated;
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, isLoading: false });
      throw error;
    }
  },

  // === MOVIMIENTOS ===
  fetchMovimientos: async (filtros = {}) => {
    set({ isLoading: true, error: null });
    try {
      const movimientos = await inventoryService.getMovimientos(filtros);
      set({ movimientos, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, isLoading: false });
    }
  },

  addEntrada: async (movimiento) => {
    set({ isLoading: true, error: null });
    try {
      const result = await inventoryService.createEntrada(movimiento);
      get().fetchInsumos();
      set({ isLoading: false });
      return result;
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, isLoading: false });
      throw error;
    }
  },

  addSalida: async (movimiento) => {
    set({ isLoading: true, error: null });
    try {
      const result = await inventoryService.createSalida(movimiento);
      get().fetchInsumos();
      set({ isLoading: false });
      return result;
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, isLoading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));

export default useInventoryStore;
