import api from "../../../services/api";

export const inventoryService = {

  // === INSUMOS ===
  async getInsumos() {
    const { data } = await api.get("/inventario/insumos");
    return data;
  },

  async createInsumo(item) {
    const { data } = await api.post("/inventario/insumos", item);
    return data;
  },

  async updateInsumo(id, item) {
    const { data } = await api.put(`/inventario/insumos/${id}`, item);
    return data;
  },

  async deleteInsumo(id) {
    await api.delete(`/inventario/insumos/${id}`);
  },

  // === MOVIMIENTOS ===
  async getMovimientos(filtros = {}) {
    const { data } = await api.get("/inventario/movimientos", { params: filtros });
    return data;
  },

  async createEntrada(movimiento) {
    const { data } = await api.post("/inventario/entrada", movimiento);
    return data;
  },

  async createSalida(movimiento) {
    const { data } = await api.post("/inventario/salida", movimiento);
    return data;
  },
};
