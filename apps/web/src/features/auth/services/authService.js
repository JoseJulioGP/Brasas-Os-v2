import api from "../../../services/api";

export const authService = {
  async login(email, password) {
    const { data } = await api.post("/auth/login", { email, password });
    const user = { ...data.user, rol: (data.user.rol || "").toUpperCase() };
    localStorage.setItem("brasas_token", data.token);
    localStorage.setItem("brasas_user", JSON.stringify(user));
    return user;
  },

  async register(nombre, email, password, tipo_registro = "jefe", codigo_invitacion = null) {
    const body = { nombre, email, password, tipo_registro };
    if (tipo_registro === "empleado" && codigo_invitacion) {
      body.codigo_invitacion = codigo_invitacion;
    }
    const { data } = await api.post("/auth/register", body);
    const user = { ...data.user, rol: (data.user.rol || "").toUpperCase() };
    localStorage.setItem("brasas_token", data.token);
    localStorage.setItem("brasas_user", JSON.stringify(user));
    return user;
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
