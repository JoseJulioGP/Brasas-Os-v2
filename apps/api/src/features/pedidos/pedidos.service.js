const db = require('../../shared/database/db');
const historialService = require('../historial/historial.service');
const { TIPOS_ACCION, ENTIDADES } = require('../../shared/constants/audit');

// SRP: Solo maneja la lógica de negocio relacionada con pedidos
// Usa transacciones para mantener consistencia de datos

class PedidosService {
<<<<<<< HEAD

=======
  // POST /pedidos - Crear pedido con items
>>>>>>> feature/frontend
  async createPedido(empleado_id, items) {
    const client = await db.connect();
    
    try {
      await client.query('BEGIN');

      // Calcular total
      let total = 0;
      for (const item of items) {
        const prod = await client.query(
          'SELECT precio_venta FROM productos WHERE id = $1 AND activo = true',
          [item.producto_id]
        );
        if (prod.rows.length === 0) throw new Error(`Producto ${item.producto_id} no encontrado`);
        total += parseFloat(prod.rows[0].precio_venta) * item.cantidad;
      }

      // Crear pedido
      const pedidoResult = await client.query(
<<<<<<< HEAD
        `INSERT INTO pedidos (empleado_id, estado, total, created_at, updated_at)
         VALUES ($1, 'pendiente', $2, NOW(), NOW()) RETURNING *`,
=======
        `INSERT INTO pedidos (empleado_id, estado, total, fecha)
        VALUES ($1, 'PENDIENTE', $2, NOW())
        RETURNING *`,
>>>>>>> feature/frontend
        [empleado_id, total]
      );
      const pedido = pedidoResult.rows[0];

      // Crear items
      for (const item of items) {
        const prod = await client.query(
          'SELECT precio_venta FROM productos WHERE id = $1',
          [item.producto_id]
        );
<<<<<<< HEAD
        const precio = parseFloat(prod.rows[0].precio_venta);
        await client.query(
          `INSERT INTO pedido_items (pedido_id, producto_id, cantidad, precio_unitario, subtotal)
           VALUES ($1, $2, $3, $4, $5)`,
          [pedido.id, item.producto_id, item.cantidad, precio, precio * item.cantidad]
=======
        
        await client.query(
          `INSERT INTO pedido_items (pedido_id, producto_id, cantidad, precio_unitario)
          VALUES ($1, $2, $3, $4)`,
          [pedido.id, item.producto_id, item.cantidad, producto.rows[0].precio_venta]
>>>>>>> feature/frontend
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
<<<<<<< HEAD
      `SELECT p.*, u.nombre AS empleado_nombre
       FROM pedidos p
       LEFT JOIN usuarios u ON p.empleado_id = u.id
       WHERE p.id = $1`,
=======
      `SELECT p.*, u.nombre as empleado_nombre
      FROM pedidos p
      LEFT JOIN usuarios u ON p.empleado_id = u.id
      WHERE p.id = $1`,
>>>>>>> feature/frontend
      [id]
    );
    
    if (pedidoResult.rows.length === 0) return null;
<<<<<<< HEAD
=======
    
>>>>>>> feature/frontend
    const pedido = pedidoResult.rows[0];

    const itemsResult = await db.query(
<<<<<<< HEAD
      `SELECT pi.*, pr.nombre AS producto_nombre
       FROM pedido_items pi
       JOIN productos pr ON pi.producto_id = pr.id
       WHERE pi.pedido_id = $1`,
=======
      `SELECT pi.*, pr.nombre as producto_nombre
      FROM pedido_items pi
      JOIN productos pr ON pi.producto_id = pr.id
      WHERE pi.pedido_id = $1`,
>>>>>>> feature/frontend
      [id]
    );

    pedido.items = itemsResult.rows;
    return pedido;
  }

  // GET /pedidos - Pedidos del empleado
  async getPedidosByEmpleado(empleado_id) {
    const result = await db.query(
<<<<<<< HEAD
      `SELECT p.*, u.nombre AS empleado_nombre
       FROM pedidos p
       LEFT JOIN usuarios u ON p.empleado_id = u.id
       WHERE p.empleado_id = $1
       ORDER BY p.created_at DESC`,
=======
      `SELECT p.* FROM pedidos p
      WHERE p.empleado_id = $1
      ORDER BY p.fecha DESC`,
>>>>>>> feature/frontend
      [empleado_id]
    );
    return result.rows;
  }

  // GET /pedidos/todos - Todos los pedidos (JEFE/ADMIN)
  async getAllPedidos() {
    const result = await db.query(
<<<<<<< HEAD
      `SELECT p.*, u.nombre AS empleado_nombre
       FROM pedidos p
       LEFT JOIN usuarios u ON p.empleado_id = u.id
       ORDER BY p.created_at DESC`
=======
      `SELECT p.*, u.nombre as empleado_nombre
      FROM pedidos p
      LEFT JOIN usuarios u ON p.empleado_id = u.id
      ORDER BY p.fecha DESC`
>>>>>>> feature/frontend
    );
    return result.rows;
  }

<<<<<<< HEAD
  async getAllWithFilters(filtros = {}) {
    let sql = `SELECT p.*, u.nombre AS empleado_nombre
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
>>>>>>> feature/frontend
    const values = [];
    let i = 1;

    if (filtros.estado)      { sql += ` AND p.estado = $${i++}`;           values.push(filtros.estado); }
    if (filtros.empleado_id) { sql += ` AND p.empleado_id = $${i++}`;      values.push(filtros.empleado_id); }
    if (filtros.fecha_inicio){ sql += ` AND p.created_at >= $${i++}`;      values.push(filtros.fecha_inicio); }
    if (filtros.fecha_fin)   { sql += ` AND p.created_at <= $${i++}`;      values.push(filtros.fecha_fin); }

    sql += ` ORDER BY p.created_at DESC`;
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
        const prod = await client.query('SELECT precio_venta FROM productos WHERE id = $1', [item.producto_id]);
        total += parseFloat(prod.rows[0].precio_venta) * item.cantidad;
      }

      // Actualizar pedido
      await client.query(
        `UPDATE pedidos SET total = $1, updated_at = NOW() WHERE id = $2`,
        [total, id]
      );
<<<<<<< HEAD
=======

      // Eliminar items antiguos
>>>>>>> feature/frontend
      await client.query('DELETE FROM pedido_items WHERE pedido_id = $1', [id]);

      // Insertar nuevos items
      for (const item of items) {
<<<<<<< HEAD
        const prod = await client.query('SELECT precio_venta FROM productos WHERE id = $1', [item.producto_id]);
        const precio = parseFloat(prod.rows[0].precio_venta);
        await client.query(
          `INSERT INTO pedido_items (pedido_id, producto_id, cantidad, precio_unitario, subtotal)
           VALUES ($1, $2, $3, $4, $5)`,
          [id, item.producto_id, item.cantidad, precio, precio * item.cantidad]
=======
        const producto = await client.query(
          'SELECT precio_venta FROM productos WHERE id = $1',
          [item.producto_id]
        );
        
        await client.query(
          `INSERT INTO pedido_items (pedido_id, producto_id, cantidad, precio_unitario)
          VALUES ($1, $2, $3, $4)`,
          [id, item.producto_id, item.cantidad, producto.rows[0].precio_venta]
>>>>>>> feature/frontend
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

<<<<<<< HEAD
      const pedidoResult = await client.query(
        `UPDATE pedidos SET estado = 'entregado', completado_at = NOW(), updated_at = NOW()
         WHERE id = $1 RETURNING *`,
        [id]
      );
      if (pedidoResult.rows.length === 0) throw new Error('PEDIDO_NO_ENCONTRADO');

      const itemsResult = await client.query(
        `SELECT pi.producto_id, pi.cantidad FROM pedido_items pi WHERE pi.pedido_id = $1`,
        [id]
      );

      for (const item of itemsResult.rows) {
=======
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
>>>>>>> feature/frontend
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
<<<<<<< HEAD
          if (stockResult.rows.length === 0) continue;

          const { stock_actual, nombre } = stockResult.rows[0];
          if (parseFloat(stock_actual) < cantidadADescontar) {
            throw new Error(`STOCK_INSUMO_INSUFICIENTE:${nombre}`);
          }

          await client.query(
            `UPDATE insumos SET stock_actual = stock_actual - $1, updated_at = NOW() WHERE id = $2`,
            [cantidadADescontar, insumo.insumo_id]
          );

          await client.query(
            `INSERT INTO stock_movimientos (insumo_id, pedido_id, tipo, cantidad, motivo, created_at)
             VALUES ($1, $2, 'salida', $3, 'Pedido completado', NOW())`,
            [insumo.insumo_id, id, cantidadADescontar]
=======
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
>>>>>>> feature/frontend
          );
        }
      }

      await client.query('COMMIT');
<<<<<<< HEAD
      const pedidoCompletado = pedidoResult.rows[0];
      historialService.registrar({
        usuario_id:  null,
        rol_id:      null,
        tipo_accion: TIPOS_ACCION.COMPLETAR,
        entidad:     ENTIDADES.PEDIDOS,
        entidad_id:  id,
        descripcion: `Pedido completado [${id}]`,
      }).catch(() => {});
      return pedidoCompletado;
    } catch (err) {
=======
    } catch (error) {
>>>>>>> feature/frontend
      await client.query('ROLLBACK');
      console.error('Error descontando stock:', error);
      throw error;
    } finally {
      client.release();
    }
  }
<<<<<<< HEAD

  async cancelPedido(id) {
    const result = await db.query(
      `UPDATE pedidos SET estado = 'cancelado', updated_at = NOW() WHERE id = $1 RETURNING id`,
      [id]
    );
    if (result.rows[0]) {
      historialService.registrar({
        usuario_id:  null,
        rol_id:      null,
        tipo_accion: TIPOS_ACCION.CANCELAR,
        entidad:     ENTIDADES.PEDIDOS,
        entidad_id:  id,
        descripcion: `Pedido cancelado [${id}]`,
      }).catch(() => {});
    }
    return result.rows[0];
  }
=======
>>>>>>> feature/frontend
}

module.exports = new PedidosService();