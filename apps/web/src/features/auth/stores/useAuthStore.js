import { create } from "zustand";
import { authService } from "../services/authService";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.login(email, password);
      set({ user, isAuthenticated: true, isLoading: false });
      return user;
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      set({ error: msg, isLoading: false });
      throw error;
    }
  },

  register: async (nombre, email, password, tipo_registro = "jefe", codigo_invitacion = null) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.register(nombre, email, password, tipo_registro, codigo_invitacion);
      set({ user, isAuthenticated: true, isLoading: false });
      return user;
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      set({ error: msg, isLoading: false });
      throw error;
    }
  },

  logout: () => {
    authService.logout();
    set({ user: null, isAuthenticated: false, error: null });
  },

  checkAuth: () => {
    const user = authService.getCurrentUser();
    if (user) {
      const normalizedUser = { ...user, rol: (user.rol || "").toUpperCase() };
      set({ user: normalizedUser, isAuthenticated: true, isLoading: false });
    } else {
      authService.logout();
      set({ isAuthenticated: false, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
