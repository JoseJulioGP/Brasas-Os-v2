const db = require('../../shared/database/db');

// SRP: Solo maneja la lógica de negocio relacionada con pedidos
// Usa transacciones para mantener consistencia de datos

class PedidosService {
  // POST /pedidos - Crear pedido con items
  async createPedido(empleado_id, items) {
    const client = await db.pool.connect();
    
    try {
      await client.query('BEGIN');

      // Calcular total
      let total = 0;
      for (const item of items) {
        const producto = await client.query(
          'SELECT precio_venta FROM productos WHERE id = $1 AND activo = true',
          [item.producto_id]
        );
        if (producto.rows.length === 0) {
          throw new Error(`Producto ${item.producto_id} no encontrado`);
        }
        total += producto.rows[0].precio_venta * item.cantidad;
      }

      // Crear pedido
      const pedidoResult = await client.query(
        `INSERT INTO pedidos (empleado_id, estado, total, fecha)
        VALUES ($1, 'pendiente', $2, NOW())
        RETURNING *`,
        [empleado_id, total]
      );
      const pedido = pedidoResult.rows[0];

      // Crear items
      for (const item of items) {
        const producto = await client.query(
          'SELECT precio_venta FROM productos WHERE id = $1',
          [item.producto_id]
        );
        
        await client.query(
          `INSERT INTO pedido_items (pedido_id, producto_id, cantidad, precio_unitario)
          VALUES ($1, $2, $3, $4)`,
          [pedido.id, item.producto_id, item.cantidad, producto.rows[0].precio_venta]
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

  // GET /pedidos/:id - Obtener pedido con items
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

  // GET /pedidos - Pedidos del empleado
  async getPedidosByEmpleado(empleado_id) {
    const result = await db.query(
      `SELECT p.* FROM pedidos p
      WHERE p.empleado_id = $1
      ORDER BY p.fecha DESC`,
      [empleado_id]
    );
    return result.rows;
  }

  // GET /pedidos/todos - Todos los pedidos (JEFE/ADMIN)
  async getAllPedidos() {
    const result = await db.query(
      `SELECT p.*, u.nombre as empleado_nombre
      FROM pedidos p
      LEFT JOIN usuarios u ON p.empleado_id = u.id
      ORDER BY p.fecha DESC`
    );
    return result.rows;
  }

  // GET /pedidos con filtros
  async getAllWithFilters(filtros) {
    let sql = `SELECT p.*, u.nombre as empleado_nombre
              FROM pedidos p
              LEFT JOIN usuarios u ON p.empleado_id = u.id
              WHERE 1=1`;
    const values = [];
    let paramIndex = 1;

    if (filtros.estado) {
      sql += ` AND p.estado = $${paramIndex++}`;
      values.push(filtros.estado);
    }
    if (filtros.empleado_id) {
      sql += ` AND p.empleado_id = $${paramIndex++}`;
      values.push(filtros.empleado_id);
    }
    if (filtros.fecha_inicio) {
      sql += ` AND p.fecha >= $${paramIndex++}`;
      values.push(filtros.fecha_inicio);
    }
    if (filtros.fecha_fin) {
      sql += ` AND p.fecha <= $${paramIndex++}`;
      values.push(filtros.fecha_fin);
    }

    sql += ` ORDER BY p.fecha DESC`;
    const result = await db.query(sql, values);
    return result.rows;
  }

  // PUT /pedidos/:id/estado - Actualizar estado
  async updateEstado(id, estado) {
    const sql = `UPDATE pedidos SET estado = $1, updated_at = NOW() WHERE id = $2 RETURNING *`;
    const result = await db.query(sql, [estado, id]);
    return result.rows[0];
  }

  // PUT /pedidos/:id - Editar pedido completo
  async updatePedido(id, items) {
    const client = await db.pool.connect();
    
    try {
      await client.query('BEGIN');

      // Recalcular total
      let total = 0;
      for (const item of items) {
        const producto = await client.query(
          'SELECT precio_venta FROM productos WHERE id = $1',
          [item.producto_id]
        );
        total += producto.rows[0].precio_venta * item.cantidad;
      }

      // Actualizar pedido
      await client.query(
        `UPDATE pedidos SET total = $1, updated_at = NOW() WHERE id = $2`,
        [total, id]
      );

      // Eliminar items antiguos
      await client.query('DELETE FROM pedido_items WHERE pedido_id = $1', [id]);

      // Insertar nuevos items
      for (const item of items) {
        const producto = await client.query(
          'SELECT precio_venta FROM productos WHERE id = $1',
          [item.producto_id]
        );
        
        await client.query(
          `INSERT INTO pedido_items (pedido_id, producto_id, cantidad, precio_unitario)
          VALUES ($1, $2, $3, $4)`,
          [id, item.producto_id, item.cantidad, producto.rows[0].precio_venta]
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

  async completarPedido(id) {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');

    const pedidoResult = await client.query(
      `UPDATE pedidos SET estado = 'entregado', updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [id]
    );
    if (pedidoResult.rows.length === 0) throw new Error('PEDIDO_NO_ENCONTRADO');

    const itemsResult = await client.query(
      `SELECT pi.producto_id, pi.cantidad,
              pc.corte_ref, pc.kg_requeridos
       FROM pedido_items pi
       LEFT JOIN producto_carnes pc ON pi.producto_id = pc.producto_id
       WHERE pi.pedido_id = $1`,
      [id]
    );

    for (const item of itemsResult.rows) {
      if (item.corte_ref && item.kg_requeridos) {
        const kgADescontar = parseFloat(item.kg_requeridos) * item.cantidad;

        const carneResult = await client.query(
          'SELECT kg_disponibles FROM carnes WHERE corte = $1 FOR UPDATE',
          [item.corte_ref]
        );

        if (carneResult.rows.length === 0) continue;

        const kgActual = parseFloat(carneResult.rows[0].kg_disponibles);
        if (kgActual < kgADescontar) {
          throw new Error(`STOCK_CARNE_INSUFICIENTE:${item.corte_ref}`);
        }

        await client.query(
          `UPDATE carnes SET kg_disponibles = kg_disponibles - $1 WHERE corte = $2`,
          [kgADescontar, item.corte_ref]
        );
      }
    }

      await client.query('COMMIT');
      return pedidoResult.rows[0];
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    }   finally {
      client.release();
    }
  }

  // DELETE /pedidos/:id - Cancelar pedido (soft delete)
  async cancelPedido(id) {
    const sql = `UPDATE pedidos SET estado = 'cancelado', updated_at = NOW() WHERE id = $1 RETURNING id`;
    const result = await db.query(sql, [id]);
    return result.rows[0];
  }

}

module.exports = new PedidosService();