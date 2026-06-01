const db = require('../../shared/database/db');
const historialService = require('../historial/historial.service');
const { TIPOS_ACCION, ENTIDADES } = require('../../shared/constants/audit');

// estado_pedido enum: pendiente | en_proceso | completado | cancelado

class PedidosService {

  async createPedido(empleado_id, items) {
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');

      let total = 0;
      for (const item of items) {
        const prod = await client.query(
          'SELECT precio_venta FROM productos WHERE id = $1 AND activo = true',
          [item.producto_id]
        );
        if (prod.rows.length === 0) throw new Error(`Producto ${item.producto_id} no encontrado`);
        total += parseFloat(prod.rows[0].precio_venta) * item.cantidad;
      }

      const pedidoResult = await client.query(
        `INSERT INTO pedidos (empleado_id, estado, total, created_at, updated_at)
         VALUES ($1, 'pendiente', $2, NOW(), NOW()) RETURNING *`,
        [empleado_id, total]
      );
      const pedido = pedidoResult.rows[0];

      for (const item of items) {
        const prod = await client.query(
          'SELECT precio_venta FROM productos WHERE id = $1',
          [item.producto_id]
        );
        const precio = parseFloat(prod.rows[0].precio_venta);
        await client.query(
          `INSERT INTO pedido_items (pedido_id, producto_id, cantidad, precio_unitario, subtotal)
           VALUES ($1, $2, $3, $4, $5)`,
          [pedido.id, item.producto_id, item.cantidad, precio, precio * item.cantidad]
        );
      }

      await client.query('COMMIT');
      return this.getPedidoById(pedido.id);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async getPedidoById(id) {
    const pedidoResult = await db.query(
      `SELECT p.*, u.nombre AS empleado_nombre
       FROM pedidos p
       LEFT JOIN usuarios u ON p.empleado_id = u.id
       WHERE p.id = $1`,
      [id]
    );
    if (pedidoResult.rows.length === 0) return null;
    const pedido = pedidoResult.rows[0];

    const itemsResult = await db.query(
      `SELECT pi.*, pr.nombre AS producto_nombre
       FROM pedido_items pi
       JOIN productos pr ON pi.producto_id = pr.id
       WHERE pi.pedido_id = $1`,
      [id]
    );
    pedido.items = itemsResult.rows;
    return pedido;
  }

  async getPedidosByEmpleado(empleado_id) {
    const result = await db.query(
      `SELECT p.*, u.nombre AS empleado_nombre
       FROM pedidos p
       LEFT JOIN usuarios u ON p.empleado_id = u.id
       WHERE p.empleado_id = $1
       ORDER BY p.created_at DESC`,
      [empleado_id]
    );
    return result.rows;
  }

  async getAllPedidos() {
    const result = await db.query(
      `SELECT p.*, u.nombre AS empleado_nombre
       FROM pedidos p
       LEFT JOIN usuarios u ON p.empleado_id = u.id
       ORDER BY p.created_at DESC`
    );
    return result.rows;
  }

  async getAllWithFilters(filtros = {}) {
    let sql = `SELECT p.*, u.nombre AS empleado_nombre
               FROM pedidos p
               LEFT JOIN usuarios u ON p.empleado_id = u.id
               WHERE 1=1`;
    const values = [];
    let i = 1;

    if (filtros.estado)       { sql += ` AND p.estado = $${i++}`;          values.push(filtros.estado); }
    if (filtros.empleado_id)  { sql += ` AND p.empleado_id = $${i++}`;     values.push(filtros.empleado_id); }
    if (filtros.fecha_inicio) { sql += ` AND p.created_at >= $${i++}`;     values.push(filtros.fecha_inicio); }
    if (filtros.fecha_fin)    { sql += ` AND p.created_at <= $${i++}`;     values.push(filtros.fecha_fin); }

    sql += ` ORDER BY p.created_at DESC`;
    const result = await db.query(sql, values);
    return result.rows;
  }

  async updateEstado(id, estado) {
    const result = await db.query(
      `UPDATE pedidos SET estado = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [estado, id]
    );
    return result.rows[0];
  }

  async updatePedido(id, items) {
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');

      let total = 0;
      for (const item of items) {
        const prod = await client.query('SELECT precio_venta FROM productos WHERE id = $1', [item.producto_id]);
        total += parseFloat(prod.rows[0].precio_venta) * item.cantidad;
      }

      await client.query(
        `UPDATE pedidos SET total = $1, updated_at = NOW() WHERE id = $2`,
        [total, id]
      );

      await client.query('DELETE FROM pedido_items WHERE pedido_id = $1', [id]);

      for (const item of items) {
        const prod = await client.query('SELECT precio_venta FROM productos WHERE id = $1', [item.producto_id]);
        const precio = parseFloat(prod.rows[0].precio_venta);
        await client.query(
          `INSERT INTO pedido_items (pedido_id, producto_id, cantidad, precio_unitario, subtotal)
           VALUES ($1, $2, $3, $4, $5)`,
          [id, item.producto_id, item.cantidad, precio, precio * item.cantidad]
        );
      }

      await client.query('COMMIT');
      return this.getPedidoById(id);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async cancelPedido(id) {
    const result = await db.query(
      `UPDATE pedidos SET estado = 'cancelado', updated_at = NOW() WHERE id = $1 RETURNING id`,
      [id]
    );
    if (result.rows[0]) {
      historialService.registrar({
        usuario_id:  null,
        tipo_accion: TIPOS_ACCION.CANCELAR,
        entidad:     ENTIDADES.PEDIDOS,
        entidad_id:  id,
        descripcion: `Pedido cancelado [${id}]`,
      }).catch(() => {});
    }
    return result.rows[0];
  }

  async descontarStock(pedidoId) {
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');

      // Marcar pedido como completado
      const pedidoResult = await client.query(
        `UPDATE pedidos SET estado = 'completado', completado_at = NOW(), updated_at = NOW()
         WHERE id = $1 RETURNING *`,
        [pedidoId]
      );
      if (pedidoResult.rows.length === 0) throw new Error('PEDIDO_NO_ENCONTRADO');

      // Obtener items del pedido
      const itemsResult = await client.query(
        `SELECT pi.producto_id, pi.cantidad FROM pedido_items pi WHERE pi.pedido_id = $1`,
        [pedidoId]
      );

      for (const item of itemsResult.rows) {
        const { producto_id, cantidad } = item;

        // Descontar insumos requeridos por el producto
        const insumosResult = await client.query(
          `SELECT pi.insumo_id, pi.cantidad_requerida
           FROM producto_insumos pi
           WHERE pi.producto_id = $1`,
          [producto_id]
        );

        for (const pi of insumosResult.rows) {
          const cantADescontar = parseFloat(pi.cantidad_requerida) * cantidad;

          const stockCheck = await client.query(
            'SELECT stock_actual, nombre FROM insumos WHERE id = $1',
            [pi.insumo_id]
          );
          if (stockCheck.rows.length === 0) continue;
          if (parseFloat(stockCheck.rows[0].stock_actual) < cantADescontar) {
            throw new Error(`STOCK_INSUMO_INSUFICIENTE:${stockCheck.rows[0].nombre}`);
          }

          await client.query(
            `UPDATE insumos SET stock_actual = stock_actual - $1, updated_at = NOW() WHERE id = $2`,
            [cantADescontar, pi.insumo_id]
          );

          await client.query(
            `INSERT INTO stock_movimientos (insumo_id, pedido_id, tipo, cantidad, motivo, created_at)
             VALUES ($1, $2, 'consumo', $3, $4, NOW())`,
            [pi.insumo_id, pedidoId, cantADescontar, `Pedido completado [${pedidoId}]`]
          );
        }
      }

      await client.query('COMMIT');

      historialService.registrar({
        usuario_id:  null,
        tipo_accion: TIPOS_ACCION.COMPLETAR,
        entidad:     ENTIDADES.PEDIDOS,
        entidad_id:  pedidoId,
        descripcion: `Pedido completado [${pedidoId}]`,
      }).catch(() => {});

      return pedidoResult.rows[0];
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
}

module.exports = new PedidosService();
