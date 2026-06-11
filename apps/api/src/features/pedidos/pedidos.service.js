const db = require('../../shared/database/db');
const historialService = require('../historial/historial.service');
const { TIPOS_ACCION, ENTIDADES } = require('../../shared/constants/audit');

class PedidosService {

  async createPedido(empleado_id, local_id, items, usuario_id) {
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');

      let total = 0;
      for (const item of items) {
        const prod = await client.query(
          `SELECT precio_venta FROM productos
           WHERE id = $1 AND local_id IS NOT DISTINCT FROM $2 AND activo = true`,
          [item.producto_id, local_id]
        );
        if (!prod.rows[0]) throw new Error(`Producto ${item.producto_id} no encontrado en este local`);
        total += parseFloat(prod.rows[0].precio_venta) * item.cantidad;
      }

      const pedidoResult = await client.query(
        `INSERT INTO pedidos (local_id, empleado_id, estado, total, created_at, updated_at)
         VALUES ($1, $2, 'pendiente', $3, NOW(), NOW()) RETURNING *`,
        [local_id, empleado_id, total]
      );
      const pedido = pedidoResult.rows[0];

      for (const item of items) {
        const prod = await client.query(
          `SELECT precio_venta FROM productos WHERE id = $1 AND local_id IS NOT DISTINCT FROM $2`,
          [item.producto_id, local_id]
        );
        const precio = parseFloat(prod.rows[0].precio_venta);
        await client.query(
          `INSERT INTO pedido_items (pedido_id, producto_id, cantidad, precio_unitario)
           VALUES ($1, $2, $3, $4)`,
          [pedido.id, item.producto_id, item.cantidad, precio]
        );
      }

      await client.query('COMMIT');

      historialService.registrar({
        usuario_id: usuario_id || empleado_id, local_id,
        tipo_accion: TIPOS_ACCION.CREAR,
        entidad: ENTIDADES.PEDIDOS,
        entidad_id: pedido.id,
        descripcion: `Pedido creado [${pedido.id}]`
      }).catch(() => {});

      return this.getPedidoById(pedido.id);
    } catch (error) { await client.query('ROLLBACK'); throw error; }
    finally { client.release(); }
  }

  async getPedidoById(id, local_id = null) {
    const whereLocal = local_id ? ' AND p.local_id = $2' : '';
    const params = local_id ? [id, local_id] : [id];
    const r = await db.query(
      `SELECT p.*, u.nombre AS empleado_nombre
       FROM pedidos p LEFT JOIN usuarios u ON p.empleado_id = u.id
       WHERE p.id = $1${whereLocal}`,
      params
    );
    if (!r.rows[0]) return null;
    const pedido = r.rows[0];
    const items = await db.query(
      `SELECT pi.*, pr.nombre AS producto_nombre
       FROM pedido_items pi JOIN productos pr ON pi.producto_id = pr.id
       WHERE pi.pedido_id = $1`,
      [id]
    );
    pedido.items = items.rows;
    return pedido;
  }

  async getPedidosByEmpleado(empleado_id, local_id) {
    const r = await db.query(
      `SELECT p.*, u.nombre AS empleado_nombre
       FROM pedidos p LEFT JOIN usuarios u ON p.empleado_id = u.id
       WHERE p.empleado_id = $1 AND p.local_id IS NOT DISTINCT FROM $2
       ORDER BY p.created_at DESC`,
      [empleado_id, local_id]
    );
    return r.rows;
  }

  async getAllPedidos(local_id) {
    const r = await db.query(
      `SELECT p.*, u.nombre AS empleado_nombre
       FROM pedidos p LEFT JOIN usuarios u ON p.empleado_id = u.id
       WHERE p.local_id IS NOT DISTINCT FROM $1
       ORDER BY p.created_at DESC`,
      [local_id]
    );
    return r.rows;
  }

  async getAllWithFilters(filtros = {}) {
    let sql = `SELECT p.*, u.nombre AS empleado_nombre
               FROM pedidos p LEFT JOIN usuarios u ON p.empleado_id = u.id
               WHERE p.local_id IS NOT DISTINCT FROM $1`;
    const values = [filtros.local_id]; let i = 2;
    if (filtros.estado)       { sql += ` AND p.estado = $${i++}`;       values.push(filtros.estado); }
    if (filtros.empleado_id)  { sql += ` AND p.empleado_id = $${i++}`;  values.push(filtros.empleado_id); }
    if (filtros.fecha_inicio) { sql += ` AND p.created_at >= $${i++}`;  values.push(filtros.fecha_inicio); }
    if (filtros.fecha_fin)    { sql += ` AND p.created_at <= $${i++}`;  values.push(filtros.fecha_fin); }
    sql += ` ORDER BY p.created_at DESC`;
    return (await db.query(sql, values)).rows;
  }

  async updateEstado(id, estado, local_id) {
    return (await db.query(
      `UPDATE pedidos SET estado = $1, updated_at = NOW()
       WHERE id = $2 AND local_id = $3 RETURNING *`,
      [estado, id, local_id]
    )).rows[0];
  }

  async updatePedido(id, local_id, items) {
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');
      let total = 0;
      for (const item of items) {
        const prod = await client.query(
          `SELECT precio_venta FROM productos WHERE id = $1 AND local_id IS NOT DISTINCT FROM $2`,
          [item.producto_id, local_id]
        );
        if (!prod.rows[0]) throw new Error(`Producto ${item.producto_id} no encontrado`);
        total += parseFloat(prod.rows[0].precio_venta) * item.cantidad;
      }
      await client.query(`UPDATE pedidos SET total = $1, updated_at = NOW() WHERE id = $2`, [total, id]);
      await client.query('DELETE FROM pedido_items WHERE pedido_id = $1', [id]);
      for (const item of items) {
        const prod = await client.query(
          `SELECT precio_venta FROM productos WHERE id = $1`, [item.producto_id]
        );
        const precio = parseFloat(prod.rows[0].precio_venta);
        await client.query(
          `INSERT INTO pedido_items (pedido_id, producto_id, cantidad, precio_unitario)
           VALUES ($1, $2, $3, $4)`,
          [id, item.producto_id, item.cantidad, precio, precio * item.cantidad]
        );
      }
      await client.query('COMMIT');
      return this.getPedidoById(id);
    } catch (error) { await client.query('ROLLBACK'); throw error; }
    finally { client.release(); }
  }

  async cancelPedido(id, usuario_id, local_id) {
    const r = await db.query(
      `UPDATE pedidos SET estado = 'cancelado', updated_at = NOW()
       WHERE id = $1 AND local_id = $2 RETURNING id`,
      [id, local_id]
    );
    if (r.rows[0]) {
      historialService.registrar({
        usuario_id, local_id,
        tipo_accion: TIPOS_ACCION.CANCELAR,
        entidad: ENTIDADES.PEDIDOS,
        entidad_id: id,
        descripcion: `Pedido cancelado [${id}]`
      }).catch(() => {});
    }
    return r.rows[0];
  }

  async completarPedido(pedidoId, usuario_id, local_id, pago = {}) {
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');

      const pedidoResult = await client.query(
        `UPDATE pedidos
         SET estado = 'completado', completado_at = NOW(), updated_at = NOW(),
             metodo_pago = $3,
             monto_efectivo = $4,
             monto_transferencia = $5
         WHERE id = $1 AND local_id = $2 AND estado != 'completado' RETURNING *`,
        [pedidoId, local_id, pago?.metodo || null, pago?.efectivo || 0, pago?.transferencia || 0]
      );
      if (!pedidoResult.rows[0]) throw new Error('PEDIDO_YA_COMPLETADO');

      // El trigger fn_completar_pedido se dispara automáticamente con el UPDATE anterior
      // y descuenta el stock de insumos. No se hace nada más aquí.

      await client.query('COMMIT');

      historialService.registrar({
        usuario_id, local_id,
        tipo_accion: TIPOS_ACCION.COMPLETAR,
        entidad: ENTIDADES.PEDIDOS,
        entidad_id: pedidoId,
        descripcion: `Pedido entregado [${pedidoId}]`
      }).catch(() => {});

      return pedidoResult.rows[0];
    } catch (err) { await client.query('ROLLBACK'); throw err; }
    finally { client.release(); }
  }
}

module.exports = new PedidosService();
