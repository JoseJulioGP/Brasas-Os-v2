import { create } from "zustand";
import { analyticsService } from "../services/analyticsService";

export const useAnalyticsStore = create((set) => ({
  productos: [],
  proyecciones: null,
  resumen: null,
  pagos: null,
  topProductos: [],
  tendencias: [],
  isLoading: false,
  isLoadingProyecciones: false,
  isLoadingResumen: false,
  error: null,

  fetchMargenes: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await analyticsService.getMargenes();
      const productos = (Array.isArray(data) ? data : data.data || [])
        .filter((p) => p.activo !== false)
        .map((p) => {
          const precio = parseFloat(p.precio_venta) || 0;
          const costo  = parseFloat(p.costo_produccion) || 0;
          return {
            ...p,
            precio_venta:     precio,
            costo_produccion: costo,
            margen:           precio - costo,
            margenPct:        precio > 0 ? ((precio - costo) / precio) * 100 : 0,
          };
        })
        .sort((a, b) => b.margenPct - a.margenPct);
      set({ productos, isLoading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Error al cargar análisis",
        isLoading: false,
      });
    }
  },

  fetchResumen: async (periodo = "mensual") => {
    set({ isLoadingResumen: true });
    try {
      const data = await analyticsService.getResumen(periodo);
      set({ resumen: data, isLoadingResumen: false });
    } catch {
      set({ isLoadingResumen: false });
    }
  },

  fetchProyecciones: async () => {
    set({ isLoadingProyecciones: true });
    try {
      const data = await analyticsService.getProyecciones();
      set({ proyecciones: data, isLoadingProyecciones: false });
    } catch {
      set({ isLoadingProyecciones: false });
    }
  },

  fetchPagos: async (periodo = "mensual") => {
    try {
      const data = await analyticsService.getResumenPagos(periodo);
      set({ pagos: data });
    } catch {
      set({ pagos: null });
    }
  },

  fetchTopProductos: async (periodo = "mensual") => {
    try {
      const data = await analyticsService.getTopProductos(periodo);
      set({ topProductos: Array.isArray(data) ? data : [] });
    } catch {
      set({ topProductos: [] });
    }
  },

  clearError: () => set({ error: null }),
}));
