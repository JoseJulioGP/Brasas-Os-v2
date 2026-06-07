import api from "../../../services/api";

export const ordersService = {
  async getOrders() {
    const response = await api.get("/pedidos");
    return response.data;
  },

  async getAllOrders() {
    const response = await api.get("/pedidos/todos");
    return response.data;
  },

  async getOrderById(id) {
    const response = await api.get(`/pedidos/${id}`);
    return response.data;
  },

  async createOrder(orderData) {
    const response = await api.post("/pedidos", orderData);
    return response.data;
  },

  async updateOrderStatus(id, estado, pago = null) {
    const response = await api.put(`/pedidos/${id}/estado`, { estado, ...(pago ? { pago } : {}) });
    return response.data;
  },

  async cancelOrder(id) {
    const response = await api.delete(`/pedidos/${id}`);
    return response.data;
  },
};
