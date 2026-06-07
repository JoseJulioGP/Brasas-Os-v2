import { create } from "zustand";
import { ordersService } from "../services/ordersService";

export const useOrdersStore = create((set, get) => ({
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
  filters: { search: "", estado: "" },

  setFilters: (filters) => set({ filters: { ...get().filters, ...filters } }),

  fetchOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const orders = await ordersService.getOrders();
      set({ orders, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error al cargar pedidos",
        isLoading: false,
      });
    }
  },

  fetchAllOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const orders = await ordersService.getAllOrders();
      set({ orders, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error al cargar pedidos",
        isLoading: false,
      });
    }
  },

  fetchOrderById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const order = await ordersService.getOrderById(id);
      set({ currentOrder: order, isLoading: false });
      return order;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error al cargar pedido",
        isLoading: false,
      });
      throw error;
    }
  },

  createOrder: async (orderData) => {
    set({ isLoading: true, error: null });
    try {
      const newOrder = await ordersService.createOrder(orderData);
      set((state) => ({
        orders: [newOrder, ...state.orders],
        isLoading: false,
      }));
      return newOrder;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error al crear pedido",
        isLoading: false,
      });
      throw error;
    }
  },

  updateOrderStatus: async (id, estado, pago = null) => {
    set({ isLoading: true, error: null });
    try {
      const updatedOrder = await ordersService.updateOrderStatus(id, estado, pago);
      set((state) => ({
        orders: state.orders.map((o) => (o.id === id ? updatedOrder : o)),
        currentOrder:
          state.currentOrder?.id === id ? updatedOrder : state.currentOrder,
        isLoading: false,
      }));
      return updatedOrder;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error al actualizar pedido",
        isLoading: false,
      });
      throw error;
    }
  },

  cancelOrder: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await ordersService.cancelOrder(id);
      set((state) => ({
        orders: state.orders.map((o) => o.id === id ? { ...o, estado: "cancelado" } : o), // cancelado sigue igual
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error al cancelar pedido",
        isLoading: false,
      });
      throw error;
    }
  },

  clearCurrentOrder: () => set({ currentOrder: null }),
  clearError: () => set({ error: null }),
}));
