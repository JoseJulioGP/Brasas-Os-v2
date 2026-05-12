import api from '../../../config/api';

export const fetchDashboardData = async (periodo) => {
  // Por ahora, obtienedatos básicos del backend
  // En Sprint 6-10 se implementarán los reportes completos
  try {
    const response = await api.get('/reportes/dashboard', {
      params: { periodo }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};

export const fetchStats = async (periodo) => {
  try {
    const response = await api.get(`/reportes/estadisticas?periodo=${periodo}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
};

export const fetchFinancialSummary = async (periodo) => {
  try {
    const response = await api.get(`/reportes/resumen?periodo=${periodo}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching financial summary:', error);
    throw error;
  }
};

export const fetchInventory = async () => {
  try {
    const response = await api.get('/inventario/carnes');
    return response.data;
  } catch (error) {
    console.error('Error fetching inventory:', error);
    throw error;
  }
};

export const fetchActionHistory = async (filtros = {}) => {
  try {
    const response = await api.get('/historial', { params: filtros });
    return response.data;
  } catch (error) {
    console.error('Error fetching action history:', error);
    throw error;
  }
};

export const fetchPedidosTurno = async (empleadoId) => {
  try {
    const response = await api.get(`/reportes/turno?empleado_id=${empleadoId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching pedidos turno:', error);
    throw error;
  }
};

export const fetchTopProducts = async () => {
  try {
    const response = await api.get('/reportes/top-productos');
    return response.data;
  } catch (error) {
    console.error('Error fetching top products:', error);
    throw error;
  }
};

// Mocks temporales para desarrollo (hasta Sprint 6)
export const mockStats = {
  dia: { pedidos: 0, ingresos: 0, clientesAtendidos: 0, stockTotal: 0 },
  semana: { pedidos: 0, ingresos: 0, clientesAtendidos: 0, stockTotal: 0 },
  mes: { pedidos: 0, ingresos: 0, clientesAtendidos: 0, stockTotal: 0 }
};

export const mockFinancial = {
  dia: { ingresos: 0, costos: 0, ganancia: 0, margen: 0 },
  semana: { ingresos: 0, costos: 0, ganancia: 0, margen: 0 },
  mes: { ingresos: 0, costos: 0, ganancia: 0, margen: 0 }
};
