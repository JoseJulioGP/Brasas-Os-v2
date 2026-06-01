const db = require('../../shared/database/db');

// SRP: Solo maneja la lógica de negocio relacionada con pedidos
// Usa transacciones para mantener consistencia de datos

class PedidosService {
  // POST /pedidos - Crear pedido con items
  async createPedido(empleado_id, items) {
    const client = await db.connect();
    
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
        VALUES ($1, 'PENDIENTE', $2, NOW())
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
    const client = await db.connect();
    
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

  // DELETE /pedidos/:id - Cancelar pedido (soft delete)
  async cancelPedido(id) {
    const sql = `UPDATE pedidos SET estado = 'CANCELADO', updated_at = NOW() WHERE id = $1 RETURNING id`;
    const result = await db.query(sql, [id]);
    return result.rows[0];
  }

  // Descontar stock al completar pedido
  async descontarStock(pedidoId) {
    const client = await db.connect();

    try {
      await client.query('BEGIN');

      const itemsResult = await client.query(
        `SELECT pi.producto_id, pi.cantidad
        FROM pedido_items pi
        WHERE pi.pedido_id = $1`,
        [pedidoId]
      );

      for (const item of itemsResult.rows) {
        const { producto_id, cantidad } = item;

        // === Descontar carnes ===
        const carnesResult = await client.query(
          `SELECT pc.carne_id, pc.kg_requeridos
          FROM producto_carnes pc
          WHERE pc.producto_id = $1 AND pc.carne_id IS NOT NULL`,
          [producto_id]
        );

        for (const pc of carnesResult.rows) {
          const kgADescontar = pc.kg_requeridos * cantidad;

          const stockCheck = await client.query(
            'SELECT kg_disponibles FROM carnes WHERE id = $1',
            [pc.carne_id]
          );
          if (stockCheck.rows.length > 0 && stockCheck.rows[0].kg_disponibles < kgADescontar) {
            throw new Error(`Stock insuficiente de carne para el producto`);
          }

          await client.query(
            'UPDATE carnes SET kg_disponibles = kg_disponibles - $1 WHERE id = $2',
            [kgADescontar, pc.carne_id]
          );
        }

        // === Descontar insumos ===
        const insumosResult = await client.query(
          `SELECT pi.insumo_id, pi.cantidad_requerida, pi.unidad
          FROM producto_insumos pi
          WHERE pi.producto_id = $1`,
          [producto_id]
        );

        for (const pi of insumosResult.rows) {
          const cantADescontar = pi.cantidad_requerida * cantidad;

          const stockCheck = await client.query(
            'SELECT stock_actual FROM insumos WHERE id = $1',
            [pi.insumo_id]
          );
          if (stockCheck.rows.length > 0 && stockCheck.rows[0].stock_actual < cantADescontar) {
            throw new Error(`Stock insuficiente de insumo para el producto`);
          }

          await client.query(
            `INSERT INTO stock_movimientos (insumo_id, usuario_id, tipo, cantidad, motivo, fecha, pedido_id)
            VALUES ($1, NULL, 'SALIDA', $2, $3, NOW(), $4)`,
            [pi.insumo_id, cantADescontar, `Pedido #${pedidoId}`, pedidoId]
          );

          await client.query(
            'UPDATE insumos SET stock_actual = stock_actual - $1 WHERE id = $2',
            [cantADescontar, pi.insumo_id]
          );
        }
      }

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error descontando stock:', error);
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = new PedidosService();