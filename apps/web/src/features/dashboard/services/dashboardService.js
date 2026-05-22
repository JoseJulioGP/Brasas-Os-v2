import api from "../../../services/api";

const periodoMap = { dia: "diario", semana: "semanal", mes: "mensual" };

const getFechaInicio = (periodo) => {
  const hoy = new Date();
  if (periodo === "dia") {
    const d = new Date(hoy); d.setHours(0, 0, 0, 0); return d;
  }
  if (periodo === "semana") {
    const d = new Date(hoy); d.setDate(hoy.getDate() - 6); d.setHours(0, 0, 0, 0); return d;
  }
  return new Date(hoy.getFullYear(), hoy.getMonth(), 1);
};

// Resumen financiero real desde /reportes/resumen
export const fetchFinancialSummary = async (periodo) => {
  try {
    const mapped = periodoMap[periodo] || "mensual";
    const { data } = await api.get(`/reportes/resumen?periodo=${mapped}`);
    return {
      ingresos: data.ingresos,
      costos: data.costo_total,
      ganancia: data.utilidad,
      margen: data.margen,
      utilidad_positiva: data.utilidad_positiva,
      variacion_utilidad: data.periodo_anterior?.variacion_utilidad ?? null,
    };
  } catch {
    try {
      const fechaInicio = getFechaInicio(periodo);
      const { data: pedidos } = await api.get("/pedidos/todos", {
        params: { fecha_inicio: fechaInicio.toISOString() },
      });
      const completados = (pedidos || []).filter((p) => p.estado === "COMPLETADO");
      const ingresos = completados.reduce((s, p) => s + (p.total || 0), 0);
      return { ingresos, costos: 0, ganancia: ingresos, margen: 0, utilidad_positiva: ingresos > 0, variacion_utilidad: null };
    } catch {
      return { ingresos: 0, costos: 0, ganancia: 0, margen: 0, utilidad_positiva: false, variacion_utilidad: null };
    }
  }
};

// Stats del período: pedidos contados + stock carnes
export const fetchStats = async (periodo) => {
  try {
    const fechaInicio = getFechaInicio(periodo);
    const [pedidosRes, carnesRes] = await Promise.allSettled([
      api.get("/pedidos/todos", { params: { fecha_inicio: fechaInicio.toISOString() } }),
      api.get("/inventario/carnes/consulta"),
    ]);
    const pedidos = pedidosRes.status === "fulfilled" ? (pedidosRes.value.data || []) : [];
    const carnes  = carnesRes.status  === "fulfilled" ? (carnesRes.value.data  || []) : [];
    const completados = pedidos.filter((p) => p.estado === "COMPLETADO");
    const ingresos = completados.reduce((s, p) => s + (p.total || 0), 0);
    const stockTotal = carnes.reduce((s, c) => s + (parseFloat(c.kg_disponibles) || 0), 0);
    return {
      pedidos: pedidos.length,
      ingresos,
      clientesAtendidos: completados.length,
      stockTotal: Math.round(stockTotal * 10) / 10,
    };
  } catch {
    return { pedidos: 0, ingresos: 0, clientesAtendidos: 0, stockTotal: 0 };
  }
};

// Inventario de carnes disponibles
export const fetchInventory = async () => {
  try {
    const { data } = await api.get("/inventario/carnes/consulta");
    return data || [];
  } catch {
    return [];
  }
};

// Top productos del día desde /reportes/turno, sin datos aleatorios
export const fetchTopProducts = async () => {
  try {
    const { data } = await api.get("/reportes/turno");
    return (data.top_productos || []).map((p) => ({
      nombre: p.nombre,
      ventas: parseInt(p.total_vendido) || 0,
    }));
  } catch {
    try {
      const { data } = await api.get("/productos");
      return (data || []).slice(0, 5).map((p) => ({ nombre: p.nombre, ventas: 0 }));
    } catch {
      return [];
    }
  }
};

// Historial basado en pedidos recientes
export const fetchActionHistory = async () => {
  try {
    const { data } = await api.get("/pedidos");
    return (data || []).slice(0, 10).map((p) => ({
      id: p.id,
      tipo_accion: p.estado,
      entidad: "pedido",
      descripcion: `Pedido #${p.id?.slice(0, 8)} - ${p.estado}`,
      fecha: p.fecha,
      usuario: p.empleado_nombre,
    }));
  } catch {
    return [];
  }
};

export const fetchDashboardData = fetchFinancialSummary;
