import api from "../../../services/api";

export const inventoryService = {
  async getAll() {
    const { data } = await api.get("/inventario");
    return data;
  },

  async create(item) {
    const { data } = await api.post("/inventario", item);
    return data;
  },

  async update(id, data) {
    const { data: result } = await api.put(`/inventario/${id}`, data);
    return result;
  },

  async delete(id) {
    await api.delete(`/inventario/${id}`);
  },
};
