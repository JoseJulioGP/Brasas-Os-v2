import api from "../../../services/api";

export const ordersService = {
  async getOrders() {
    const response = await api.get("/pedidos");
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

  async updateOrderStatus(id, estado) {
    const response = await api.put(`/pedidos/${id}/estado`, { estado });
    return response.data;
  }
};