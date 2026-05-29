import api from "../../../services/api";

export const historyService = {
  getHistorial: async (params = {}) => {
    const clean = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== "" && v !== null && v !== undefined)
    );
    const { data } = await api.get("/historial", { params: clean });
    return data;
  },
};
