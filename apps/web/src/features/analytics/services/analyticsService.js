import api from "../../../services/api";

export const analyticsService = {
  async getMargenes() {
    const { data } = await api.get("/productos/costos");
    return data;
  },

  async getResumen() {
    const { data } = await api.get("/dashboard");
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
};
