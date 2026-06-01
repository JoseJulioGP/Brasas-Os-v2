import api from "../../../services/api";

export const historyService = {
<<<<<<< HEAD
  getHistory: async (params = {}) => {
    const { data } = await api.get("/pedidos/todos", { params });
    return data;
  },

  getHistoryByDate: async (start, end) => {
    const { data } = await api.get("/pedidos/todos", {
      params: { fecha_inicio: start, fecha_fin: end },
    });
=======
  getHistorial: async (params = {}) => {
    const clean = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== "" && v !== null && v !== undefined)
    );
    const { data } = await api.get("/historial", { params: clean });
>>>>>>> 47bba80be1627d21fba2a8195396ca4b89bcaebf
    return data;
  },
};
