import { query } from '../config/db.js';
import { ValidationError } from '../utils/errors.js';

export class DetallePedidoService {
  /**
   * Obtener todos los detalles de pedidos
   * @param {Object} filters - { pedido_id }
   * @returns {Array} - Lista de detalles
   */
  async findAll(filters = {}) {
    let queryText = `
      SELECT 
        dp.*,
        p.nombre as producto_nombre,
        car.nombre_corte as carne_nombre
      FROM detalle_pedido dp
      LEFT JOIN productos p ON dp.producto_id = p.id
      LEFT JOIN carnes car ON dp.carne_id = car.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.pedido_id !== undefined) {
      queryText += ` AND dp.pedido_id = $${params.length + 1}`;
      params.push(filters.pedido_id);
    }

    queryText += ' ORDER BY dp.pedido_id, dp.id';

    const result = await query(queryText, params);
    return result.rows;
  }

  /**
   * Obtener detalle por ID
   * @param {number} id - ID del detalle
   * @returns {Object} - Detalle del pedido
   */
  async findById(id) {
    const result = await query(
      `SELECT 
        dp.*,
        p.nombre as producto_nombre,
        car.nombre_corte as carne_nombre
      FROM detalle_pedido dp
      LEFT JOIN productos p ON dp.producto_id = p.id
      LEFT JOIN carnes car ON dp.carne_id = car.id
      WHERE dp.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      throw new ValidationError('Detalle de pedido no encontrado', 404);
    }

    return result.rows[0];
  }

  /**
   * Crear nuevo detalle de pedido
   * @param {Object} detalleData - Datos del detalle
   * @returns {Object} - Detalle creado
   */
  async create(detalleData) {
    const result = await query(
      `INSERT INTO detalle_pedido (
        pedido_id, producto_id, carne_id, cantidad, kg_carne, subtotal
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [
        detalleData.pedido_id,
        detalleData.producto_id,
        detalleData.carne_id,
        detalleData.cantidad,
        detalleData.kg_carne,
        detalleData.subtotal
      ]
    );

    if (result.rows.length === 0) {
      throw new ValidationError('Error al crear el detalle', 500);
    }

    return result.rows[0];
  }

  /**
   * Actualizar detalle de pedido
   * @param {number} id - ID del detalle
   * @param {Object} detalleData - Datos para actualizar
   * @returns {Object} - Detalle actualizado
   */
  async update(id, detalleData) {
    const fields = [];
    const params = [];
    let paramIndex = 1;

    if (detalleData.producto_id !== undefined) {
      fields.push(`producto_id = $${paramIndex}`);
      params.push(detalleData.producto_id);
    }

    if (detalleData.carne_id !== undefined) {
      fields.push(`carne_id = $${paramIndex}`);
      params.push(detalleData.carne_id);
    }

    if (detalleData.cantidad !== undefined) {
      fields.push(`cantidad = $${paramIndex}`);
      params.push(detalleData.cantidad);
    }

    if (detalleData.kg_carne !== undefined) {
      fields.push(`kg_carne = $${paramIndex}`);
      params.push(detalleData.kg_carne);
    }

    if (detalleData.subtotal !== undefined) {
      fields.push(`subtotal = $${paramIndex}`);
      params.push(detalleData.subtotal);
    }

    if (fields.length === 0) {
      throw new ValidationError('No se proporcionaron campos para actualizar', 400);
    }

    fields.push(`WHERE id = $${paramIndex}`);
    params.push(id);

    const queryText = `UPDATE detalle_pedido SET ${fields.join(', ')} RETURNING *`;

    const result = await query(queryText, params);

    if (result.rows.length === 0) {
      throw new ValidationError('Detalle de pedido no encontrado', 404);
    }

    return result.rows[0];
  }

  /**
   * Eliminar detalle de pedido
   * @param {number} id - ID del detalle
   * @returns {boolean} - Estado de la operación
   */
  async delete(id) {
    const result = await query(
      "UPDATE detalle_pedido SET producto_id = NULL WHERE id = $1",
      [id]
    );

    return result.rowCount > 0;
  }

  /**
   * Obtener total de pedido
   * @param {number} pedidoId - ID del pedido
   * @returns {Object} - Totales del pedido
   */
  async getPedidoTotals(pedidoId) {
    const result = await query(
      `SELECT 
        SUM(subtotal) as total,
        COUNT(*) as items,
        SUM(kg_carne) as total_kg_carne
      FROM detalle_pedido
      WHERE pedido_id = $1
      AND producto_id IS NOT NULL`,
      [pedidoId]
    );

    return result.rows[0];
  }
}
