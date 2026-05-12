import api from "../../../services/api";
export const authService = {
  async login(email, password) {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("brasas_token", data.token);
    localStorage.setItem("brasas_user", JSON.stringify(data.user));
    return data.user;
  },
  async register(nombre, email, password) {
    const { data } = await api.post("/auth/register", { nombre, email, password });
    localStorage.setItem("brasas_token", data.token);
    localStorage.setItem("brasas_user", JSON.stringify(data.user));
    return data.user;
  },
  async getCurrentUser() {
    const stored = localStorage.getItem("brasas_user");
    if (!stored) return null;
    const token = localStorage.getItem("brasas_token");
    if (!token) return null;
    try {
      const { data } = await api.get("/auth/me");
      return data.user;
    } catch {
      return JSON.parse(stored);
    }
  },
  logout() {
    localStorage.removeItem("brasas_token");
    localStorage.removeItem("brasas_user");
  },
  getToken() {
    return localStorage.getItem('brasas_token');
  },

  isAuthenticated() {
    return !!localStorage.getItem('brasas_token');
  }
};
