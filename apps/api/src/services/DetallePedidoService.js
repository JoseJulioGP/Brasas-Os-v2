const db = require('../shared/database');

class DetallePedidoService {
  async obtenerPorId(id) {
    try {
      const sql = `SELECT dp.*, p.producto_id, p.nombre as nombre_producto, 
                          p.precio_venta, dp.cantidad, dp.subtotal
                    FROM detalle_pedido dp
                    JOIN productos p ON dp.producto_id = p.id
                    WHERE dp.id = $1`;
      const result = await db.query(sql, [id]);
      return result.rows[0];
    } catch (error) {
      console.error("Error obteniendo detalle:", error);
    }
  }

  async obtenerTodosPorPedido(pedidoId) {
    try {
      const sql = `SELECT dp.*, p.producto_id, p.nombre as nombre_producto,
                          p.precio_venta, dp.cantidad, dp.subtotal
                    FROM detalle_pedido dp
                    JOIN productos p ON dp.producto_id = p.id
                    WHERE dp.pedido_id = $1
                    ORDER BY dp.cantidad DESC`;
      const result = await db.query(sql, [pedidoId]);
      return result.rows;
    } catch (error) {
      console.error("Error obteniendo detalles del pedido:", error);
    }
  }

  async crearDetallePedido(data) {
    try {
      const sql = `INSERT INTO detalle_pedido (pedido_id, producto_id, cantidad, subtotal) 
                    VALUES ($1, $2, $3, $4) RETURNING *`;
      const result = await db.query(sql, [
        data.pedido_id, 
        data.producto_id, 
        data.cantidad, 
        data.subtotal
      ]);
      return result.rows[0];
    } catch (error) {
      console.error("Error creando detalle de pedido:", error);
    }
  }

  async eliminarDetallePedido(id) {
    try {
      const sql = `UPDATE detalle_pedido SET activo = false WHERE id = $1`;
      const result = await db.query(sql, [id]);
      return result.rowCount > 0;
    } catch (error) {
      console.error("Error eliminando detalle:", error);
    }
  }

  async obtenerSubtotalPedido(pedidoId) {
    try {
      const sql = `SELECT SUM(dp.cantidad * dp.precio_unitario) as subtotal 
                    FROM detalle_pedido dp
                    WHERE dp.pedido_id = $1 AND dp.activo = true`;
      const result = await db.query(sql, [pedidoId]);
      return result.rows[0];
    } catch (error) {
      console.error("Error obteniendo subtotal:", error);
    }
  }
}

module.exports = new DetallePedidoService();
