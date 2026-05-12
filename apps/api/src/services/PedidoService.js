const db = require('../shared/database');

class PedidoService {
  async obtenerTodos() {
    try {
      const sql = `SELECT p.*, u.nombre as usuario_nombre, 
                          c.nombre as categoria_nombre
                   FROM pedidos p
                   JOIN usuarios u ON p.usuario_id = u.id
                   LEFT JOIN categorias c ON p.categoria_id = c.id
                   WHERE p.activo = true
                   ORDER BY p.fecha_creacion DESC`;
      const result = await db.query(sql);
      return result.rows;
    } catch (error) {
      console.error("Error obteniendo pedidos:", error);
    }
  }

  async obtenerPorId(id) {
    try {
      const sql = `SELECT * FROM pedidos WHERE id = $1 AND activo = true`;
      const result = await db.query(sql, [id]);
      return result.rows[0];
    } catch (error) {
      console.error("Error obteniendo pedido:", error);
    }
  }

  async obtenerPorEstado(estado) {
    try {
      const sql = `SELECT * FROM pedidos WHERE estado = $1 AND activo = true
                    ORDER BY fecha_creacion DESC`;
      const result = await db.query(sql, [estado]);
      return result.rows;
    } catch (error) {
      console.error("Error obteniendo pedidos por estado:", error);
    }
  }

  async obtenerPorMesas(mesa) {
    try {
      const sql = `SELECT * FROM pedidos WHERE mesa = $1 AND activo = true
                    ORDER BY fecha_creacion DESC`;
      const result = await db.query(sql, [mesa]);
      return result.rows;
    } catch (error) {
      console.error("Error obteniendo pedidos por mesa:", error);
    }
  }

  async crearPedido(data) {
    try {
      const sql = `INSERT INTO pedidos (mesa, subtotal, estado, activo) 
                    VALUES ($1, $2, $3, true) RETURNING *`;
      const result = await db.query(sql, [data.mesa, data.subtotal, data.estado]);
      return result.rows[0];
    } catch (error) {
      console.error("Error creando pedido:", error);
    }
  }

  async actualizarPedido(id, data) {
    try {
      const sql = `UPDATE pedidos 
                    SET subtotal = COALESCE($1, subtotal),
                        estado = COALESCE($2, estado),
                        observaciones = COALESCE($3, observaciones)
                    WHERE id = $4 AND activo = true RETURNING *`;
      const result = await db.query(sql, [
        data.subtotal, 
        data.estado, 
        data.observaciones, 
        id
      ]);
      return result.rows[0];
    } catch (error) {
      console.error("Error actualizando pedido:", error);
    }
  }

  async eliminarPedido(id) {
    try {
      const sql = `UPDATE pedidos SET activo = false WHERE id = $1`;
      const result = await db.query(sql, [id]);
      return result.rowCount > 0;
    } catch (error) {
      console.error("Error eliminando pedido:", error);
    }
  }

  async obtenerPedidosPorFecha(inicio, fin) {
    try {
      const sql = `SELECT * FROM pedidos
                    WHERE fecha_creacion BETWEEN $1 AND $2 AND activo = true
                    ORDER BY fecha_creacion DESC`;
      const result = await db.query(sql, [inicio, fin]);
      return result.rows;
    } catch (error) {
      console.error("Error obteniendo pedidos por fecha:", error);
    }
  }
}

module.exports = new PedidoService();
