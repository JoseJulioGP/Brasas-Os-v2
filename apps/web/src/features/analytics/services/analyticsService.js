import api from "../../../services/api";

export const analyticsService = {
  async getMargenes() {
    const { data } = await api.get("/productos/costos");
    return data;
  },

  async getResumen(periodo = "mensual") {
    const { data } = await api.get(`/reportes/resumen?periodo=${periodo}`);
    return data;
  },

  async getTendencias(periodo = "semana") {
    const { data } = await api.get("/pedidos/todos", { params: { periodo } });
    return data;
  },

  async getProyecciones() {
    const { data } = await api.get("/reportes/proyecciones");
    return data;
  },

  async getResumenPagos(periodo = "mensual") {
    const { data } = await api.get(`/reportes/pagos?periodo=${periodo}`);
    return data;
  },

  async getTopProductos(periodo = "mensual") {
    const { data } = await api.get(`/reportes/top-productos?periodo=${periodo}`);
    return data;
  },
};
