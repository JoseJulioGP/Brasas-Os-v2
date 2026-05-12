import api from '../../../config/api';

export const authService = {
  async login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    
    // Guardar usuario y token en localStorage
    localStorage.setItem('brasas_user', JSON.stringify(data.user));
    localStorage.setItem('brasas_token', data.token);
    
    return data.user;
  },

  async register(nombre, email, password) {
    const { data } = await api.post('/auth/register', { nombre, email, password });
    
    // Guardar usuario y token en localStorage
    localStorage.setItem('brasas_user', JSON.stringify(data.user));
    localStorage.setItem('brasas_token', data.token);
    
    return data.user;
  },

  async getCurrentUser() {
    const stored = localStorage.getItem('brasas_user');
    if (!stored) return null;
    
    const user = JSON.parse(stored);
    const token = localStorage.getItem('brasas_token');
    
    if (!token) return null;
    
    return user;
  },

  logout() {
    localStorage.removeItem('brasas_user');
    localStorage.removeItem('brasas_token');
  },

  getToken() {
    return localStorage.getItem('brasas_token');
  },

  isAuthenticated() {
    return !!localStorage.getItem('brasas_token');
  }
};