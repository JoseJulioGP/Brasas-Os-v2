import { create } from "zustand";
import { analyticsService } from "../services/analyticsService";

export const useAnalyticsStore = create((set) => ({
  productos: [],
  resumen: null,
  tendencias: [],
  isLoading: false,
  error: null,

  fetchMargenes: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await analyticsService.getMargenes();
      const productos = (Array.isArray(data) ? data : data.data || [])
        .filter((p) => p.activo !== false)
        .map((p) => ({
          ...p,
          margen: p.precio_venta - (p.costo_produccion || 0),
          margenPct:
            p.precio_venta > 0
              ? ((p.precio_venta - (p.costo_produccion || 0)) / p.precio_venta) * 100
              : 0,
        }))
        .sort((a, b) => b.margenPct - a.margenPct);
      set({ productos, isLoading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Error al cargar análisis",
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
