import api from "../../../services/api";

export const historyService = {
  getHistory: async (params = {}) => {
    const { data } = await api.get("/pedidos/todos", { params });
    return data;
  },

  getHistoryByDate: async (start, end) => {
    const { data } = await api.get("/pedidos/todos", {
      params: { fecha_inicio: start, fecha_fin: end },
    });
    return data;
  },
};
