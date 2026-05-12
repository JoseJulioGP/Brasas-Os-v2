import api from "../../../services/api";

// Dashboard data - usa endpoints reales cuando existan, si no usa mocks
export const fetchDashboardData = async (periodo) => {
  try {
    const { data } = await api.get(`/reportes/dashboard?periodo=${periodo}`);
    return data;
  } catch (error) {
    console.log('Dashboard endpoint no disponible, usando datos de pedidos');
    return fetchFromPedidos(periodo);
  }
};
<<<<<<< Updated upstream
<<<<<<< Updated upstream
=======

=======
<<<<<<< HEAD
<<<<<<< HEAD

=======
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
const fetchFromPedidos = async (periodo) => {
  try {
    const pedidos = await api.get('/pedidos/todos');
    const productos = await api.get('/productos');
    const carnes = await api.get('/inventario/carnes/consulta');
    
    const pedidosData = pedidos.data || [];
    const productosData = productos.data || [];
    const carnesData = carnes.data || [];

    const hoy = new Date();
    let pedidosFiltrados = pedidosData;

    if (periodo === 'dia') {
      pedidosFiltrados = pedidosData.filter(p => {
        const fecha = new Date(p.fecha);
        return fecha.toDateString() === hoy.toDateString();
      });
    } else if (periodo === 'semana') {
      const haceUnaSemana = new Date(hoy.getTime() - 7 * 24 * 60 * 60 * 1000);
      pedidosFiltrados = pedidosData.filter(p => new Date(p.fecha) >= haceUnaSemana);
    }

    const ingresos = pedidosFiltrados.reduce((sum, p) => sum + (p.total || 0), 0);
    const stockTotal = carnesData.reduce((sum, c) => sum + (c.kg_disponibles || 0), 0);

    return {
      pedidos: pedidosFiltrados.length,
      ingresos,
      clientesAtendidos: pedidosFiltrados.length,
      stockTotal,
      productosActivos: productosData.length
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return getMockData(periodo);
  }
};

// Stats - obtiene datos de pedidos y productos
<<<<<<< Updated upstream
=======
>>>>>>> feature/frontend
>>>>>>> Stashed changes
export const fetchStats = async (periodo) => {
  try {
    const response = await api.get(`/reportes/estadisticas?periodo=${periodo}`);
    return response.data;
  } catch (error) {
<<<<<<< Updated upstream
    const data = await fetchFromPedidos(periodo);
    return {
      dia: { pedidos: data.pedidos, ingresos: data.ingresos, clientesAtendidos: data.clientesAtendidos, stockTotal: data.stockTotal },
      semana: { pedidos: data.pedidos * 3, ingresos: data.ingresos * 3, clientesAtendidos: data.clientesAtendidos * 3, stockTotal: data.stockTotal },
      mes: { pedidos: data.pedidos * 15, ingresos: data.ingresos * 15, clientesAtendidos: data.clientesAtendidos * 15, stockTotal: data.stockTotal }
    };
  }
};

// Resumen financiero - calcula desde pedidos
=======
<<<<<<< HEAD
    console.error('Error fetching stats:', error);
    throw error;
  }
};

=======
    const data = await fetchFromPedidos(periodo);
    return {
      dia: { pedidos: data.pedidos, ingresos: data.ingresos, clientesAtendidos: data.clientesAtendidos, stockTotal: data.stockTotal },
      semana: { pedidos: data.pedidos * 3, ingresos: data.ingresos * 3, clientesAtendidos: data.clientesAtendidos * 3, stockTotal: data.stockTotal },
      mes: { pedidos: data.pedidos * 15, ingresos: data.ingresos * 15, clientesAtendidos: data.clientesAtendidos * 15, stockTotal: data.stockTotal }
    };
  }
};

// Resumen financiero - calcula desde pedidos
>>>>>>> feature/frontend
>>>>>>> Stashed changes
export const fetchFinancialSummary = async (periodo) => {
  try {
    const response = await api.get(`/reportes/resumen?periodo=${periodo}`);
    return response.data;
  } catch (error) {
<<<<<<< Updated upstream
    const data = await fetchFromPedidos(periodo);
    const ingresos = data.ingresos || 0;
    const costos = ingresos * 0.4; // Estimado 40%
    const ganancia = ingresos - costos;
    const margen = ingresos > 0 ? (ganancia / ingresos) * 100 : 0;

    return {
      dia: { ingresos, costos, ganancia, margen },
      semana: { ingresos: ingresos * 7, costos: costos * 7, ganancia: ganancia * 7, margen },
      mes: { ingresos: ingresos * 30, costos: costos * 30, ganancia: ganancia * 30, margen }
    };
=======
<<<<<<< HEAD
    console.error('Error fetching financial summary:', error);
    throw error;
>>>>>>> Stashed changes
  }
};

// Inventario - obtiene datos reales del backend
export const fetchInventory = async () => {
  try {
    const response = await api.get('/inventario/carnes/consulta');
    return response.data;
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return [];
  }
};

// Historial de acciones - obtiene pedidos como historial
export const fetchActionHistory = async (filtros = {}) => {
  try {
    const response = await api.get('/pedidos', { params: filtros });
    return response.data.map(p => ({
      id: p.id,
      tipo_accion: p.estado,
      entidad: 'pedido',
      descripcion: `Pedido #${p.id?.slice(0, 8)} - ${p.estado}`,
      fecha: p.fecha,
      usuario: p.empleado_nombre
    }));
  } catch (error) {
    console.error('Error fetching action history:', error);
    return [];
  }
};

// Pedidos del turno actual
export const fetchPedidosTurno = async () => {
  try {
    const response = await api.get('/pedidos');
    return response.data;
  } catch (error) {
    console.error('Error fetching pedidos turno:', error);
    return [];
  }
};

// Top productos - obtiene desde productos
export const fetchTopProducts = async () => {
  try {
    const response = await api.get('/productos');
    const productos = response.data || [];
    return productos.slice(0, 5).map(p => ({
      id: p.id,
      nombre: p.nombre,
      ventas: Math.floor(Math.random() * 50) + 10,
      ingresos: p.precio_venta * (Math.floor(Math.random() * 50) + 10)
    }));
  } catch (error) {
    console.error('Error fetching top products:', error);
    return [];
  }
};

<<<<<<< Updated upstream
=======
// Mocks temporales para desarrollo (hasta Sprint 6)
=======
    const data = await fetchFromPedidos(periodo);
    const ingresos = data.ingresos || 0;
    const costos = ingresos * 0.4; // Estimado 40%
    const ganancia = ingresos - costos;
    const margen = ingresos > 0 ? (ganancia / ingresos) * 100 : 0;

    return {
      dia: { ingresos, costos, ganancia, margen },
      semana: { ingresos: ingresos * 7, costos: costos * 7, ganancia: ganancia * 7, margen },
      mes: { ingresos: ingresos * 30, costos: costos * 30, ganancia: ganancia * 30, margen }
    };
  }
};

// Inventario - obtiene datos reales del backend
export const fetchInventory = async () => {
  try {
    const response = await api.get('/inventario/carnes/consulta');
    return response.data;
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return [];
  }
};

// Historial de acciones - obtiene pedidos como historial
export const fetchActionHistory = async (filtros = {}) => {
  try {
    const response = await api.get('/pedidos', { params: filtros });
    return response.data.map(p => ({
      id: p.id,
      tipo_accion: p.estado,
      entidad: 'pedido',
      descripcion: `Pedido #${p.id?.slice(0, 8)} - ${p.estado}`,
      fecha: p.fecha,
      usuario: p.empleado_nombre
    }));
  } catch (error) {
    console.error('Error fetching action history:', error);
    return [];
  }
};

// Pedidos del turno actual
export const fetchPedidosTurno = async () => {
  try {
    const response = await api.get('/pedidos');
    return response.data;
  } catch (error) {
    console.error('Error fetching pedidos turno:', error);
    return [];
  }
};

// Top productos - obtiene desde productos
export const fetchTopProducts = async () => {
  try {
    const response = await api.get('/productos');
    const productos = response.data || [];
    return productos.slice(0, 5).map(p => ({
      id: p.id,
      nombre: p.nombre,
      ventas: Math.floor(Math.random() * 50) + 10,
      ingresos: p.precio_venta * (Math.floor(Math.random() * 50) + 10)
    }));
  } catch (error) {
    console.error('Error fetching top products:', error);
    return [];
  }
};

>>>>>>> Stashed changes
// Fallback: datos mock
const getMockData = (periodo) => ({
  pedidos: 0,
  ingresos: 0,
  clientesAtendidos: 0,
  stockTotal: 0,
  productosActivos: 0
});

<<<<<<< Updated upstream
=======
>>>>>>> feature/frontend
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
<<<<<<< HEAD
=======
>>>>>>> feature/frontend
=======
>>>>>>> Stashed changes
>>>>>>> feature/frontend
>>>>>>> Stashed changes
