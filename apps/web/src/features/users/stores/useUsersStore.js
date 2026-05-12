import { create } from "zustand";
import { usersService } from "../services/usersService";

export const useUsersStore = create((set, get) => ({
  users: [],
  currentUser: null,
  isLoading: false,
  error: null,

  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const users = await usersService.getUsers();
      set({ users, isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || "Error al cargar usuarios", 
        isLoading: false 
      });
    }
  },

  fetchUserById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const user = await usersService.getUserById(id);
      set({ currentUser: user, isLoading: false });
      return user;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || "Error al cargar usuario", 
        isLoading: false 
      });
      throw error;
    }
  },

  createUser: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const newUser = await usersService.createUser(userData);
      set((state) => ({ 
        users: [...state.users, newUser], 
        isLoading: false 
      }));
      return newUser;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || "Error al crear usuario", 
        isLoading: false 
      });
      throw error;
    }
  },

  updateUser: async (id, userData) => {
    set({ isLoading: true, error: null });
    try {
      const updatedUser = await usersService.updateUser(id, userData);
      set((state) => ({
        users: state.users.map((u) => u.id === id ? updatedUser : u),
        currentUser: state.currentUser?.id === id ? updatedUser : state.currentUser,
        isLoading: false
      }));
      return updatedUser;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || "Error al actualizar usuario", 
        isLoading: false 
      });
      throw error;
    }
  },

  deactivateUser: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await usersService.deactivateUser(id);
      set((state) => ({
        users: state.users.filter((u) => u.id !== id),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error.response?.data?.message || "Error al desactivar usuario", 
        isLoading: false 
      });
      throw error;
    }
  },

  clearCurrentUser: () => set({ currentUser: null }),
  clearError: () => set({ error: null })
}));