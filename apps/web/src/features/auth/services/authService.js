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

  getCurrentUser() {
    const token = localStorage.getItem("brasas_token");
    const stored = localStorage.getItem("brasas_user");
    if (!token || !stored) return null;

    try {
      // Verificar expiración del token sin librería (decodificando el payload)
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        this.logout();
        return null;
      }
      return JSON.parse(stored);
    } catch {
      this.logout();
      return null;
    }
  },

  logout() {
    localStorage.removeItem("brasas_token");
    localStorage.removeItem("brasas_user");
  },

  getToken() {
    return localStorage.getItem("brasas_token");
  },

  isAuthenticated() {
    return !!this.getCurrentUser();
  },
};
