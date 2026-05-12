import { create } from "zustand";
import { inventoryService } from "../services/inventoryService";

const useInventoryStore = create((set, get) => ({
  // Estado
  carnes: [],
  insumos: [],
  movimientos: [],
  isLoading: false,
  error: null,

  // === CARNES ===
  
  // Obtener todas las carnes
  fetchCarnes: async () => {
    set({ isLoading: true, error: null });
    try {
      const carnes = await inventoryService.getCarnes();
      set({ carnes, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, isLoading: false });
    }
  },

  // Obtener carnes disponibles
  fetchCarnesDisponibles: async () => {
    set({ isLoading: true, error: null });
    try {
      const carnes = await inventoryService.getCarnesDisponibles();
      set({ carnes, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, isLoading: false });
    }
  },

  // Crear carne
  addCarne: async (item) => {
    set({ isLoading: true, error: null });
    try {
      const newItem = await inventoryService.createCarne(item);
      set((state) => ({ 
        carnes: [...state.carnes, { ...newItem, nombre: newItem.corte, cantidad: newItem.kg_disponibles, unidad: 'kg' }], 
        isLoading: false 
      }));
      return newItem;
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, isLoading: false });
      throw error;
    }
  },

  // Actualizar carne
  updateCarne: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await inventoryService.updateCarne(id, data);
      set((state) => ({
        carnes: state.carnes.map((c) => (c.id === id ? { ...updated, nombre: updated.corte } : c)),
        isLoading: false
      }));
      return updated;
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, isLoading: false });
      throw error;
    }
  },

  // === INSUMOS ===

  // Obtener insumos
  fetchInsumos: async () => {
    set({ isLoading: true, error: null });
    try {
      const insumos = await inventoryService.getInsumos();
      set({ insumos, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, isLoading: false });
    }
  },

  // Crear insumo
  addInsumo: async (item) => {
    set({ isLoading: true, error: null });
    try {
      const newItem = await inventoryService.createInsumo(item);
      set((state) => ({ 
        insumos: [...state.insumos, newItem], 
        isLoading: false 
      }));
      return newItem;
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, isLoading: false });
      throw error;
    }
  },

  // Actualizar insumo
  updateInsumo: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await inventoryService.updateInsumo(id, data);
      set((state) => ({
        insumos: state.insumos.map((i) => (i.id === id ? updated : i)),
        isLoading: false
      }));
      return updated;
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, isLoading: false });
      throw error;
    }
  },

  // === COMBINADO ===

  // Obtener todo el inventario
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

  // Obtener movimientos
  fetchMovimientos: async (filtros = {}) => {
    set({ isLoading: true, error: null });
    try {
      const movimientos = await inventoryService.getMovimientos(filtros);
      set({ movimientos, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, isLoading: false });
    }
  },

  // Crear movimiento
  addMovimiento: async (movimiento) => {
    set({ isLoading: true, error: null });
    try {
      const newMovimiento = await inventoryService.createMovimiento(movimiento);
      set((state) => ({ 
        movimientos: [newMovimiento, ...state.movimientos], 
        isLoading: false 
      }));
      return newMovimiento;
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, isLoading: false });
      throw error;
    }
  },

  // Limpiar error
  clearError: () => set({ error: null })
}));

export default useInventoryStore;