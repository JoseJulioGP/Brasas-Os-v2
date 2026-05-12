import { create } from "zustand";
import { authService } from "../services/authService";

export const useAuthStore = create((set,) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.login(email, password);
      localStorage.setItem("brasas_user", JSON.stringify(user));
      set({ user, isAuthenticated: true, isLoading: false });
      return user;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  register: async (nombre, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.register(nombre, email, password);
      localStorage.setItem("brasas_user", JSON.stringify(user));
      set({ user, isAuthenticated: true, isLoading: false });
      return user;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("brasas_user");
    set({ user: null, isAuthenticated: false, error: null });
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const user = await authService.getCurrentUser();
      if (user) {
        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));