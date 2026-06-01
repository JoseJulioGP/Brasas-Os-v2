import api from "../../../services/api";

export const inventoryService = {

  // === CARNES ===
  async getCarnes() {
    const { data } = await api.get("/inventario/carnes");
    return data;
  },

  async createCarne(item) {
    const { data } = await api.post("/inventario/carnes", item);
    return data;
  },

  async updateCarne(id, item) {
    const { data } = await api.put(`/inventario/carnes/${id}`, item);
    return data;
  },

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

  // === COMBINADO ===
  async getAllInventory() {
    const [carnesRes, insumosRes] = await Promise.allSettled([
      this.getCarnes(),
      this.getInsumos(),
    ]);

    const carnes = carnesRes.status === "fulfilled"
      ? carnesRes.value.map((c) => ({
          id: c.id,
          nombre: c.corte,
          cantidad: c.kg_disponibles,
          unidad: "kg",
          precio: c.precio_por_kg,
          stock_minimo: c.stock_minimo,
          alerta_stock: c.alerta_stock,
          tipo: "carne",
        }))
      : [];

    const insumos = insumosRes.status === "fulfilled"
      ? insumosRes.value
      : [];

    return { carnes, insumos };
  },
};
