import { create } from "zustand";
import { inventoryService } from "../services/inventoryService";

const useInventoryStore = create((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  fetchItems: async () => {
    set({ isLoading: true, error: null });
    try {
      const items = await inventoryService.getAll();
      set({ items, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  addItem: async (item) => {
    set({ isLoading: true, error: null });
    try {
      const newItem = await inventoryService.create(item);
      set((state) => ({ items: [...state.items, newItem], isLoading: false }));
      return newItem;
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  updateItem: async (id, data) => {
    try {
      const updated = await inventoryService.update(id, data);
      set((state) => ({
        items: state.items.map((i) => (i.id === id ? updated : i)),
      }));
    } catch (error) {
      set({ error: error.message });
    }
  },

  deleteItem: async (id) => {
    try {
      await inventoryService.delete(id);
      set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
    } catch (error) {
      set({ error: error.message });
    }
  },
}));

export default useInventoryStore;
