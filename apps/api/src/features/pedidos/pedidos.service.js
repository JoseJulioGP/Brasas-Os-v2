const db = require('../../shared/database/db');

<<<<<<< Updated upstream
class PedidosService {
=======
// SRP: Solo maneja la lógica de negocio relacionada con pedidos
// Usa transacciones para mantener consistencia de datos

class PedidosService {
  // POST /pedidos - Crear pedido con items
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
         VALUES ($1, 'PENDIENTE', $2, NOW())
         RETURNING *`,
=======
        VALUES ($1, 'PENDIENTE', $2, NOW())
        RETURNING *`,
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
           VALUES ($1, $2, $3, $4)`,
=======
          VALUES ($1, $2, $3, $4)`,
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
  async getPedidoById(id) {
    const pedidoResult = await db.query(
      `SELECT p.*, u.nombre as empleado_nombre
       FROM pedidos p
       LEFT JOIN usuarios u ON p.empleado_id = u.id
       WHERE p.id = $1`,
=======
  // GET /pedidos/:id - Obtener pedido con items
  async getPedidoById(id) {
    const pedidoResult = await db.query(
      `SELECT p.*, u.nombre as empleado_nombre
      FROM pedidos p
      LEFT JOIN usuarios u ON p.empleado_id = u.id
      WHERE p.id = $1`,
>>>>>>> Stashed changes
      [id]
    );
    
    if (pedidoResult.rows.length === 0) return null;
    
    const pedido = pedidoResult.rows[0];

    const itemsResult = await db.query(
      `SELECT pi.*, pr.nombre as producto_nombre
<<<<<<< Updated upstream
       FROM pedido_items pi
       JOIN productos pr ON pi.producto_id = pr.id
       WHERE pi.pedido_id = $1`,
=======
      FROM pedido_items pi
      JOIN productos pr ON pi.producto_id = pr.id
      WHERE pi.pedido_id = $1`,
>>>>>>> Stashed changes
      [id]
    );

    pedido.items = itemsResult.rows;
    return pedido;
  }

<<<<<<< Updated upstream
  async getPedidosByEmpleado(empleado_id) {
    const result = await db.query(
      `SELECT p.* FROM pedidos p
       WHERE p.empleado_id = $1
       ORDER BY p.fecha DESC`,
=======
  // GET /pedidos - Pedidos del empleado
  async getPedidosByEmpleado(empleado_id) {
    const result = await db.query(
      `SELECT p.* FROM pedidos p
      WHERE p.empleado_id = $1
      ORDER BY p.fecha DESC`,
>>>>>>> Stashed changes
      [empleado_id]
    );
    return result.rows;
  }

<<<<<<< Updated upstream
  async getAllPedidos() {
    const result = await db.query(
      `SELECT p.*, u.nombre as empleado_nombre
       FROM pedidos p
       LEFT JOIN usuarios u ON p.empleado_id = u.id
       ORDER BY p.fecha DESC`
=======
  // GET /pedidos/todos - Todos los pedidos (JEFE/ADMIN)
  async getAllPedidos() {
    const result = await db.query(
      `SELECT p.*, u.nombre as empleado_nombre
      FROM pedidos p
      LEFT JOIN usuarios u ON p.empleado_id = u.id
      ORDER BY p.fecha DESC`
>>>>>>> Stashed changes
    );
    return result.rows;
  }

<<<<<<< Updated upstream
  async getAllWithFilters(filtros) {
    let sql = `SELECT p.*, u.nombre as empleado_nombre
               FROM pedidos p
               LEFT JOIN usuarios u ON p.empleado_id = u.id
               WHERE 1=1`;
=======
  // GET /pedidos con filtros
  async getAllWithFilters(filtros) {
    let sql = `SELECT p.*, u.nombre as empleado_nombre
              FROM pedidos p
              LEFT JOIN usuarios u ON p.empleado_id = u.id
              WHERE 1=1`;
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
=======
  // PUT /pedidos/:id/estado - Actualizar estado
>>>>>>> Stashed changes
  async updateEstado(id, estado) {
    const sql = `UPDATE pedidos SET estado = $1, updated_at = NOW() WHERE id = $2 RETURNING *`;
    const result = await db.query(sql, [estado, id]);
    return result.rows[0];
  }

<<<<<<< Updated upstream
=======
  // PUT /pedidos/:id - Editar pedido completo
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
           VALUES ($1, $2, $3, $4)`,
=======
          VALUES ($1, $2, $3, $4)`,
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
=======
  // DELETE /pedidos/:id - Cancelar pedido (soft delete)
>>>>>>> Stashed changes
  async cancelPedido(id) {
    const sql = `UPDATE pedidos SET estado = 'CANCELADO', updated_at = NOW() WHERE id = $1 RETURNING id`;
    const result = await db.query(sql, [id]);
    return result.rows[0];
  }

<<<<<<< Updated upstream
=======
  // Descontar stock al completar pedido
>>>>>>> Stashed changes
  async descontarStock(pedidoId) {
    const client = await db.connect();
    
    try {
      await client.query('BEGIN');

<<<<<<< Updated upstream
      // Obtener items del pedido
      const itemsResult = await client.query(
        `SELECT pi.producto_id, pi.cantidad, pc.kg_requeridos
         FROM pedido_items pi
         LEFT JOIN producto_carnes pc ON pi.producto_id = pc.producto_id
         WHERE pi.pedido_id = $1`,
=======
      const itemsResult = await client.query(
        `SELECT pi.producto_id, pi.cantidad, pc.kg_requeridos
        FROM pedido_items pi
        LEFT JOIN producto_carnes pc ON pi.producto_id = pc.producto_id
        WHERE pi.pedido_id = $1`,
>>>>>>> Stashed changes
        [pedidoId]
      );

      for (const item of itemsResult.rows) {
<<<<<<< Updated upstream
        // Descontar stock de producto si existe
=======
>>>>>>> Stashed changes
        await client.query(
          `UPDATE productos SET stock_actual = stock_actual - $1 WHERE id = $2`,
          [item.cantidad, item.producto_id]
        );

<<<<<<< Updated upstream
        // Descontar kg de carne si aplica
=======
>>>>>>> Stashed changes
        if (item.kg_requeridos) {
          const kgADescontar = item.kg_requeridos * item.cantidad;
          await client.query(
            `UPDATE carnes SET kg_disponibles = kg_disponibles - $1 
<<<<<<< Updated upstream
             WHERE id = (SELECT carne_id FROM producto_carnes WHERE producto_id = $2)`,
=======
            WHERE id = (SELECT carne_id FROM producto_carnes WHERE producto_id = $2)`,
>>>>>>> Stashed changes
            [kgADescontar, item.producto_id]
          );
        }
      }

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error descontando stock:', error);
    } finally {
      client.release();
    }
  }
}

module.exports = new PedidosService();