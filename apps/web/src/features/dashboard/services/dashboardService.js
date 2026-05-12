export const mockStats = {
  dia: {
    pedidos: 28,
    ingresos: 245000,
    clientesAtendidos: 24,
    stockTotal: 85
  },
  semana: {
    pedidos: 156,
    ingresos: 1420000,
    clientesAtendidos: 142,
    stockTotal: 85
  },
  mes: {
    pedidos: 624,
    ingresos: 5680000,
    clientesAtendidos: 568,
    stockTotal: 85
  }
};

export const mockFinancial = {
  dia: {
    ingresos: 245000,
    costos: 98000,
    ganancia: 147000,
    margen: 60
  },
  semana: {
    ingresos: 1420000,
    costos: 568000,
    ganancia: 852000,
    margen: 60
  },
  mes: {
    ingresos: 5680000,
    costos: 2272000,
    ganancia: 3408000,
    margen: 60
  }
};

export const mockInventory = [
  { id: 1, nombre: "Carne de Res", cantidad: 25, unidad: "kg", stockMinimo: 10, precioKg: 18000, ultimaActualizacion: "2026-05-11 08:30", proveedor: "Carnes Premium" },
  { id: 2, nombre: "Pollo", cantidad: 20, unidad: "kg", stockMinimo: 8, precioKg: 12000, ultimaActualizacion: "2026-05-10 14:15", proveedor: "Avícola del Sur" },
  { id: 3, nombre: "Chuleta", cantidad: 15, unidad: "kg", stockMinimo: 5, precioKg: 22000, ultimaActualizacion: "2026-05-11 06:45", proveedor: "Carnes Premium" },
  { id: 4, nombre: "Costillas", cantidad: 12, unidad: "kg", stockMinimo: 5, precioKg: 20000, ultimaActualizacion: "2026-05-09 10:00", proveedor: "Distribuidora BBQ" },
  { id: 5, nombre: "Cerdo", cantidad: 8, unidad: "kg", stockMinimo: 8, precioKg: 16000, ultimaActualizacion: "2026-05-08 16:20", proveedor: "Carnes Premium" },
  { id: 6, nombre: "Pichinchas", cantidad: 5, unidad: "kg", stockMinimo: 3, precioKg: 25000, ultimaActualizacion: "2026-05-11 07:00", proveedor: "Distribuidora BBQ" }
];

export const mockActionHistory = [
  { id: 1, usuario: "Admin", accion: "Creó pedido #452", tipo: "pedido", fecha: "2026-04-23 14:30", icono: "pedido" },
  { id: 2, usuario: "Admin", accion: "Actualizó inventario: Carne de Res +10kg", tipo: "inventario", fecha: "2026-04-23 13:15", icono: "inventario" },
  { id: 3, usuario: "Caja", accion: "Registró pago pedido #451", tipo: "pago", fecha: "2026-04-23 12:45", icono: "pago" },
  { id: 4, usuario: "Admin", accion: "Creó usuario: Juan Pérez", tipo: "usuario", fecha: "2026-04-23 11:20", icono: "usuario" },
  { id: 5, usuario: "Admin", accion: "Eliminó producto: Salchicha", tipo: "producto", fecha: "2026-04-22 18:30", icono: "producto" },
  { id: 6, usuario: "Caja", accion: "Canceló pedido #448", tipo: "cancel", fecha: "2026-04-22 17:00", icono: "cancel" },
  { id: 7, usuario: "Admin", accion: "Actualizó inventario: Pollo +15kg", tipo: "inventario", fecha: "2026-04-22 10:00", icono: "inventario" },
  { id: 8, usuario: "Caja", accion: "Registró pago pedido #445", tipo: "pago", fecha: "2026-04-21 20:15", icono: "pago" }
];

export const fetchDashboardData = async (periodo) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return {
    stats: mockStats[periodo],
    financial: mockFinancial[periodo],
    inventory: mockInventory,
    actionHistory: mockActionHistory
  };
};