import { create } from "zustand";
import { menuService } from "../services/menuService";

export const useMenuStore = create((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  fetchAll: async () => {
    set({ isLoading: true, error: null });
    try {
      const items = await menuService.getAll();
      set({ items, isLoading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Error al cargar menú",
        isLoading: false,
      });
    }
  },

  create: async (producto) => {
    set({ isLoading: true, error: null });
    try {
      const created = await menuService.create(producto);
      set((state) => ({ items: [...state.items, created], isLoading: false }));
      return created;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Error al crear producto",
        isLoading: false,
      });
      throw err;
    }
  },

  update: async (id, producto) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await menuService.update(id, producto);
      set((state) => ({
        items: state.items.map((i) => (i.id === id ? updated : i)),
        isLoading: false,
      }));
      return updated;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Error al actualizar producto",
        isLoading: false,
      });
      throw err;
    }
  },

  remove: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await menuService.remove(id);
      set((state) => ({
        items: state.items.filter((i) => i.id !== id),
        isLoading: false,
      }));
    } catch (err) {
      set({
        error: err.response?.data?.message || "Error al eliminar producto",
        isLoading: false,
      });
      throw err;
    }
  },

  clearError: () => set({ error: null }),
}));
