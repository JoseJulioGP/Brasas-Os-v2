import api from "../../../services/api";

export const menuService = {
  async getAll() {
    const { data } = await api.get("/productos");
    return Array.isArray(data) ? data : (data?.data || []);
  },

  async getWithCosts() {
    const { data } = await api.get("/productos/costos");
    return data;
  },

  async getById(id) {
    const { data } = await api.get(`/productos/${id}`);
    return data;
  },

  async create(producto) {
    const { data } = await api.post("/productos", producto);
    return data;
  },

  async update(id, producto) {
    const { data } = await api.put(`/productos/${id}`, producto);
    return data;
  },

  async remove(id) {
    const { data } = await api.delete(`/productos/${id}`);
    return data;
  },

  async getCategorias() {
    const { data } = await api.get("/productos/categorias");
    return data;
  },

  async createCategoria(nombre) {
    const { data } = await api.post("/productos/categorias", { nombre });
    return data;
  },

  async deleteCategoria(id) {
    await api.delete(`/productos/categorias/${id}`);
  },
};
