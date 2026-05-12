import api from "../../../services/api";

export const usersService = {
  async getUsers() {
    const response = await api.get("/usuarios");
    return response.data;
  },

  async getUserById(id) {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  },

  async createUser(userData) {
    const response = await api.post("/usuarios", userData);
    return response.data;
  },

  async updateUser(id, userData) {
    const response = await api.put(`/usuarios/${id}`, userData);
    return response.data;
  },

  async deactivateUser(id) {
    const response = await api.delete(`/usuarios/${id}`);
    return response.data;
  },

  async activateUser(id) {
    const response = await api.put(`/usuarios/${id}`, { activo: true });
    return response.data;
  }
};