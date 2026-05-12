const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockInventory = [
  { id: 1, nombre: "Carne de Res", cantidad: 25, unidad: "kg", stockMinimo: 10, precio: 18000, categoria: "carnes", proveedor: "Carnes Premium", ultimaActualizacion: "2026-05-11 08:30" },
  { id: 2, nombre: "Pollo", cantidad: 20, unidad: "kg", stockMinimo: 8, precio: 12000, categoria: "carnes", proveedor: "Avícola del Sur", ultimaActualizacion: "2026-05-10 14:15" },
  { id: 3, nombre: "Chuleta", cantidad: 15, unidad: "kg", stockMinimo: 5, precio: 22000, categoria: "carnes", proveedor: "Carnes Premium", ultimaActualizacion: "2026-05-11 06:45" },
  { id: 4, nombre: "Costillas", cantidad: 12, unidad: "kg", stockMinimo: 5, precio: 20000, categoria: "carnes", proveedor: "Distribuidora BBQ", ultimaActualizacion: "2026-05-09 10:00" },
  { id: 5, nombre: "Cerdo", cantidad: 8, unidad: "kg", stockMinimo: 8, precio: 16000, categoria: "carnes", proveedor: "Carnes Premium", ultimaActualizacion: "2026-05-08 16:20" },
  { id: 6, nombre: "Pichinchas", cantidad: 5, unidad: "kg", stockMinimo: 3, precio: 25000, categoria: "carnes", proveedor: "Distribuidora BBQ", ultimaActualizacion: "2026-05-11 07:00" },
  { id: 7, nombre: "Paca de Vasos 12oz", cantidad: 10, unidad: "pacas", stockMinimo: 3, precio: 8500, categoria: "empaques", proveedor: "Distribuidora de Empaques", ultimaActualizacion: "2026-05-10 09:00" },
  { id: 8, nombre: "Portacomidas #7", cantidad: 200, unidad: "unid", stockMinimo: 50, precio: 1200, categoria: "empaques", proveedor: "Empaques SAS", ultimaActualizacion: "2026-05-09 11:30" },
  { id: 9, nombre: "Portacomidas #5", cantidad: 150, unidad: "unid", stockMinimo: 50, precio: 1000, categoria: "empaques", proveedor: "Empaques SAS", ultimaActualizacion: "2026-05-09 11:30" },
  { id: 10, nombre: "Salsa de Tomate", cantidad: 8, unidad: "lt", stockMinimo: 4, precio: 5500, categoria: "salsas", proveedor: "Salsas La Huerta", ultimaActualizacion: "2026-05-08 16:00" },
  { id: 11, nombre: "Mayonesa", cantidad: 6, unidad: "lt", stockMinimo: 3, precio: 6200, categoria: "salsas", proveedor: "Salsas La Huerta", ultimaActualizacion: "2026-05-08 16:00" },
  { id: 12, nombre: "Carbón Vegetal", cantidad: 15, unidad: "bultos", stockMinimo: 5, precio: 18000, categoria: "carbon", proveedor: "Carbones del Llano", ultimaActualizacion: "2026-05-11 06:00" },
  { id: 13, nombre: "Leña", cantidad: 3, unidad: "bultos", stockMinimo: 2, precio: 15000, categoria: "carbon", proveedor: "Carbones del Llano", ultimaActualizacion: "2026-05-10 07:00" },
  { id: 14, nombre: "Coca-Cola 1.5L", cantidad: 24, unidad: "unid", stockMinimo: 12, precio: 4000, categoria: "bebidas", proveedor: "Distribuidora de Bebidas", ultimaActualizacion: "2026-05-11 10:00" },
  { id: 15, nombre: "Agua sin Gas 500ml", cantidad: 48, unidad: "unid", stockMinimo: 24, precio: 1500, categoria: "bebidas", proveedor: "Distribuidora de Bebidas", ultimaActualizacion: "2026-05-11 10:00" },
  { id: 16, nombre: "Servilletas Paquete x50", cantidad: 20, unidad: "unid", stockMinimo: 8, precio: 2500, categoria: "varios", proveedor: "Descartables Ltda", ultimaActualizacion: "2026-05-07 14:00" },
];

let inventoryData = [...mockInventory];
let nextId = 17;

export const inventoryService = {
  async getAll() {
    await delay(200);
    return [...inventoryData];
  },

  async create(item) {
    await delay(300);
    const newItem = {
      id: nextId++,
      nombre: item.nombre,
      cantidad: Number(item.cantidad),
      unidad: item.unidad,
      stockMinimo: Number(item.stockMinimo) || 1,
      precio: Number(item.precio) || 0,
      categoria: item.categoria || "varios",
      proveedor: item.proveedor || "—",
      ultimaActualizacion: new Date().toISOString().replace("T", " ").slice(0, 16),
    };
    inventoryData.push(newItem);
    return newItem;
  },

  async update(id, data) {
    await delay(200);
    const idx = inventoryData.findIndex((i) => i.id === id);
    if (idx === -1) throw new Error("Insumo no encontrado");
    inventoryData[idx] = { ...inventoryData[idx], ...data, ultimaActualizacion: new Date().toISOString().replace("T", " ").slice(0, 16) };
    return inventoryData[idx];
  },

  async delete(id) {
    await delay(200);
    inventoryData = inventoryData.filter((i) => i.id !== id);
  },
};
