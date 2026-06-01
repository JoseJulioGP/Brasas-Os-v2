import { create } from "zustand";
import { inventoryService } from "../services/inventoryService";

const useInventoryStore = create((set, get) => ({
  carnes: [],
  insumos: [],
  movimientos: [],
  isLoading: false,
  error: null,

  // === CARNES ===
  fetchCarnes: async () => {
    set({ isLoading: true, error: null });
    try {
      const carnes = await inventoryService.getCarnes();
      set({ carnes, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, isLoading: false });
    }
  },

  addCarne: async (item) => {
    set({ isLoading: true, error: null });
    try {
      const newItem = await inventoryService.createCarne(item);
      set((state) => ({ carnes: [...state.carnes, newItem], isLoading: false }));
      return newItem;
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, isLoading: false });
      throw error;
    }
  },

  updateCarne: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await inventoryService.updateCarne(id, data);
      set((state) => ({
        carnes: state.carnes.map((c) => (c.id === id ? updated : c)),
        isLoading: false,
      }));
      return updated;
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, isLoading: false });
      throw error;
    }
  },

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

  // === COMBINADO ===
  fetchAll: async () => {
    set({ isLoading: true, error: null });
    try {
      const { carnes, insumos } = await inventoryService.getAllInventory();
      set({ carnes, insumos, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, isLoading: false });
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
      // Refrescar stock del insumo correspondiente
      get().fetchAll();
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
      get().fetchAll();
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
