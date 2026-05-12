import api from "../../../services/api";

// Servicio de inventario que conecta con el backend
// Endpoints disponibles: /inventario/carnes, /inventario/insumos, /inventario/movimientos

export const inventoryService = {
  // === CARNES ===
  
  // GET /inventario/carnes - Todas las carnes (solo JEFE)
  async getCarnes() {
    try {
      const { data } = await api.get("/inventario/carnes");
      return data;
    } catch (error) {
      console.error('Error fetching carnes:', error);
      throw error;
    }
  },

  // GET /inventario/carnes/consulta - Carnes disponibles (todos los roles)
  async getCarnesDisponibles() {
    try {
      const { data } = await api.get("/inventario/carnes/consulta");
      return data;
    } catch (error) {
      console.error('Error fetching carnes disponibles:', error);
      throw error;
    }
  },

  // POST /inventario/carnes - Crear carne (solo JEFE)
  async createCarne(item) {
    try {
      const { data } = await api.post("/inventario/carnes", item);
      return data;
    } catch (error) {
      console.error('Error creating carne:', error);
      throw error;
    }
  },

  // PUT /inventario/carnes/:id - Actualizar carne (solo JEFE)
  async updateCarne(id, data) {
    try {
      const { data: result } = await api.put(`/inventario/carnes/${id}`, data);
      return result;
    } catch (error) {
      console.error('Error updating carne:', error);
      throw error;
    }
  },

  // === INSUMOS ===

  // GET /inventario/insumos - Lista de insumos (solo JEFE)
  async getInsumos() {
    try {
      const { data } = await api.get("/inventario/insumos");
      return data;
    } catch (error) {
      console.error('Error fetching insumos:', error);
      throw error;
    }
  },

  // POST /inventario/insumos - Crear insumo (solo JEFE)
  async createInsumo(item) {
    try {
      const { data } = await api.post("/inventario/insumos", item);
      return data;
    } catch (error) {
      console.error('Error creating insumo:', error);
      throw error;
    }
  },

  // PUT /inventario/insumos/:id - Actualizar insumo (solo JEFE)
  async updateInsumo(id, data) {
    try {
      const { data: result } = await api.put(`/inventario/insumos/${id}`, data);
      return result;
    } catch (error) {
      console.error('Error updating insumo:', error);
      throw error;
    }
  },

  // === MOVIMIENTOS ===

  // GET /inventario/movimientos - Historial de movimientos (solo JEFE)
  async getMovimientos(filtros = {}) {
    try {
      const { data } = await api.get("/inventario/movimientos", { params: filtros });
      return data;
    } catch (error) {
      console.error('Error fetching movimientos:', error);
      throw error;
    }
  },

  // POST /inventario/movimientos - Crear movimiento (solo JEFE)
  async createMovimiento(movimiento) {
    try {
      const { data } = await api.post("/inventario/movimientos", movimiento);
      return data;
    } catch (error) {
      console.error('Error creating movimiento:', error);
      throw error;
    }
  },

  // === MÉTODOS COMBINADOS ===

  // Obtiene todo el inventario (carnes + insumos)
  async getAllInventory() {
    try {
      const [carnes, insumos] = await Promise.all([
        this.getCarnesDisponibles(),
        this.getInsumos().catch(() => [])
      ]);

      return {
        carnes: carnes.map(c => ({
          id: c.id,
          nombre: c.corte,
          cantidad: c.kg_disponibles,
          unidad: 'kg',
          precio: c.precio_por_kg,
          categoria: 'carnes',
          tipo: 'carne'
        })),
        insumos: insumos.map(i => ({
          id: i.id,
          nombre: i.nombre,
          cantidad: i.stock_actual,
          unidad: i.unidad_medida,
          stockMinimo: i.stock_minimo,
          categoria: i.categoria,
          tipo: 'insumo'
        }))
      };
    } catch (error) {
      console.error('Error fetching all inventory:', error);
      throw error;
    }
  }
};