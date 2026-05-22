const db = require('../../shared/database/db');

class PedidosService {
  async createPedido(empleado_id, items) {
    const client = await db.pool.connect(); // fix Bug 1
    try {
      await client.query('BEGIN');

      let total = 0;
      const precios = {};
      for (const item of items) {
        const res = await client.query(
          'SELECT precio_venta FROM productos WHERE id = $1 AND activo = true',
          [item.producto_id]
        );
        if (res.rows.length === 0) throw new Error(`Producto ${item.producto_id} no encontrado`);
        precios[item.producto_id] = res.rows[0].precio_venta;
        total += precios[item.producto_id] * item.cantidad;
      }

      const pedidoResult = await client.query(
        `INSERT INTO pedidos (empleado_id, estado, total, fecha)
         VALUES ($1, 'PENDIENTE', $2, NOW())
         RETURNING *`,
        [empleado_id, total]
      );
      const pedido = pedidoResult.rows[0];

      for (const item of items) {
        await client.query(
          `INSERT INTO pedido_items (pedido_id, producto_id, cantidad, precio_unitario)
           VALUES ($1, $2, $3, $4)`,
          [pedido.id, item.producto_id, item.cantidad, precios[item.producto_id]]
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
      `SELECT p.*, u.nombre as empleado_nombre
       FROM pedidos p
       LEFT JOIN usuarios u ON p.empleado_id = u.id
       WHERE p.id = $1`,
      [id]
    );
    if (pedidoResult.rows.length === 0) return null;

    const pedido = pedidoResult.rows[0];
    const itemsResult = await db.query(
      `SELECT pi.*, pr.nombre as producto_nombre
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
      `SELECT p.* FROM pedidos p
       WHERE p.empleado_id = $1
       ORDER BY p.fecha DESC`,
      [empleado_id]
    );
    return result.rows;
  }

  async getAllPedidos() {
    const result = await db.query(
      `SELECT p.*, u.nombre as empleado_nombre
       FROM pedidos p
       LEFT JOIN usuarios u ON p.empleado_id = u.id
       ORDER BY p.fecha DESC`
    );
    return result.rows;
  }

  async getAllWithFilters(filtros) {
    let sql = `SELECT p.*, u.nombre as empleado_nombre
               FROM pedidos p
               LEFT JOIN usuarios u ON p.empleado_id = u.id
               WHERE 1=1`;
    const values = [];
    let i = 1;

    if (filtros.estado)      { sql += ` AND p.estado = $${i++}`;         values.push(filtros.estado); }
    if (filtros.empleado_id) { sql += ` AND p.empleado_id = $${i++}`;    values.push(filtros.empleado_id); }
    if (filtros.fecha_inicio){ sql += ` AND p.fecha >= $${i++}`;         values.push(filtros.fecha_inicio); }
    if (filtros.fecha_fin)   { sql += ` AND p.fecha <= $${i++}`;         values.push(filtros.fecha_fin); }

    sql += ` ORDER BY p.fecha DESC`;
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
    const client = await db.pool.connect(); // fix Bug 1
    try {
      await client.query('BEGIN');

      let total = 0;
      const precios = {};
      for (const item of items) {
        const res = await client.query(
          'SELECT precio_venta FROM productos WHERE id = $1',
          [item.producto_id]
        );
        precios[item.producto_id] = res.rows[0].precio_venta;
        total += precios[item.producto_id] * item.cantidad;
      }

      await client.query(
        `UPDATE pedidos SET total = $1, updated_at = NOW() WHERE id = $2`,
        [total, id]
      );
      await client.query('DELETE FROM pedido_items WHERE pedido_id = $1', [id]);

      for (const item of items) {
        await client.query(
          `INSERT INTO pedido_items (pedido_id, producto_id, cantidad, precio_unitario)
           VALUES ($1, $2, $3, $4)`,
          [id, item.producto_id, item.cantidad, precios[item.producto_id]]
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
      `UPDATE pedidos SET estado = 'CANCELADO', updated_at = NOW() WHERE id = $1 RETURNING id`,
      [id]
    );
    return result.rows[0];
  }

  // T-33: descuento atómico de kg de carnes al completar pedido
  async descontarStock(pedidoId) {
    const client = await db.pool.connect(); // fix Bug 1
    try {
      await client.query('BEGIN');

      const itemsResult = await client.query(
        `SELECT pi.producto_id, pi.cantidad,
                pc.corte_ref, pc.kg_requeridos
         FROM pedido_items pi
         LEFT JOIN producto_carnes pc ON pi.producto_id = pc.producto_id
         WHERE pi.pedido_id = $1`,
        [pedidoId]
      );

      for (const item of itemsResult.rows) {
        // Solo descontar carnes si el producto tiene configuración de carne (T-33)
        if (item.corte_ref && item.kg_requeridos) {
          const kgADescontar = parseFloat(item.kg_requeridos) * item.cantidad;

          // Verificar que no queden kg negativos antes de descontar
          const carneResult = await client.query(
            'SELECT kg_disponibles FROM carnes WHERE corte = $1',
            [item.corte_ref]
          );
          if (carneResult.rows.length > 0) {
            const kgActual = parseFloat(carneResult.rows[0].kg_disponibles);
            if (kgActual < kgADescontar) {
              throw new Error(`STOCK_CARNE_INSUFICIENTE:${item.corte_ref}`);
            }
          }

          // Fix Bug 2: usar corte_ref para encontrar la carne, no carne_id
          await client.query(
            `UPDATE carnes
             SET kg_disponibles = kg_disponibles - $1
             WHERE corte = $2`,
            [kgADescontar, item.corte_ref]
          );
          // Fix Bug 3: eliminada la línea que intentaba actualizar productos.stock_actual
        }
      }

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error; // relanzar para que el controller lo maneje
    } finally {
      client.release();
    }
  }
}

module.exports = new PedidosService();