import { create } from "zustand";
import { analyticsService } from "../services/analyticsService";

export const useAnalyticsStore = create((set) => ({
  productos: [],
  proyecciones: null,
  resumen: null,
  tendencias: [],
  isLoading: false,
  isLoadingProyecciones: false,
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

  fetchProyecciones: async () => {
    set({ isLoadingProyecciones: true });
    try {
      const data = await analyticsService.getProyecciones();
      set({ proyecciones: data, isLoadingProyecciones: false });
    } catch {
      set({ isLoadingProyecciones: false });
    }
  },

  clearError: () => set({ error: null }),
}));
