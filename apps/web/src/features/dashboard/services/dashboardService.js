import api from "../../../services/api";

export const fetchDashboardData = async (periodo) => {
  const { data } = await api.get(`/dashboard?periodo=${periodo}`);
  return data;
};
