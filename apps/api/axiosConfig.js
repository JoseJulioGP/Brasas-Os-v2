import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  withCredentials: true, // Permite enviar cookies/tokens de sesión al backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de Peticiones: Ideal para inyectar el Token JWT automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // O donde guardes tu JWT
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de Respuestas: Ideal para manejar errores globales (ej. Token expirado)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Lógica para cerrar sesión o refrescar token
      console.error("No autorizado, redirigiendo al login...");
    }
    return Promise.reject(error);
  }
);

export default api;