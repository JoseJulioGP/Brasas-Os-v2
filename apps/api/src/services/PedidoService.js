import { query } from '../config/db.js';
import { ValidationError } from '../utils/errors.js';

export class PedidoService {
  /**
   * Obtener todos los pedidos
   * @param {Object} filters - { estado, empleado_id, fecha_inicio, fecha_fin }
   * @returns {Array} - Lista de pedidos
   */
  async findAll(filters = {}) {
    let queryText = `
      SELECT 
        p.*,
        e.nombre as empleado_nombre
      FROM pedidos p
      LEFT JOIN usuarios e ON p.empleado_id = e.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.estado !== undefined) {
      queryText += ` AND p.estado = $${params.length + 1}`;
      params.push(filters.estado);
    }

    if (filters.empleado_id !== undefined) {
      queryText += ` AND p.empleado_id = $${params.length + 1}`;
      params.push(filters.empleado_id);
    }

    if (filters.fecha_inicio && filters.fecha_fin) {
      queryText += ` AND p.fecha_creacion BETWEEN $${params.length + 1} AND $${params.length + 2}`;
      params.push(filters.fecha_inicio, filters.fecha_fin);
    }

    queryText += ' ORDER BY p.fecha_creacion DESC';

    const result = await query(queryText, params);
    return result.rows;
  }

  /**
   * Obtener pedido por ID
   * @param {number} id - ID del pedido
   * @returns {Object} - Pedido con detalles
   */
  async findById(id) {
    const result = await query(
      `SELECT 
        p.*,
        e.nombre as empleado_nombre
      FROM pedidos p
      LEFT JOIN usuarios e ON p.empleado_id = e.id
      WHERE p.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      throw new ValidationError('Pedido no encontrado', 404);
    }

    return result.rows[0];
  }

  /**
   * Crear nuevo pedido
   * @param {Object} pedidoData - Datos del pedido
   * @returns {Object} - Pedido creado
   */
  async create(pedidoData) {
    const result = await query(
      `INSERT INTO pedidos (
        empleado_id, mesa, estado, fecha_creacion
      ) VALUES ($1, $2, $3, $4)
      RETURNING id, empleado_id, mesa, estado, fecha_creacion`,
      [
        pedidoData.empleado_id,
        pedidoData.mesa,
        pedidoData.estado,
        pedidoData.fecha_creacion || new Date()
      ]
    );

    if (result.rows.length === 0) {
      throw new ValidationError('Error al crear el pedido', 500);
    }

    return result.rows[0];
  }

  /**
   * Actualizar pedido
   * @param {number} id - ID del pedido
   * @param {Object} pedidoData - Datos para actualizar
   * @returns {Object} - Pedido actualizado
   */
  async update(id, pedidoData) {
    const fields = [];
    const params = [];
    let paramIndex = 1;

    if (pedidoData.empleado_id !== undefined) {
      fields.push(`empleado_id = $${paramIndex}`);
      params.push(pedidoData.empleado_id);
    }

    if (pedidoData.mesa !== undefined) {
      fields.push(`mesa = $${paramIndex}`);
      params.push(pedidoData.mesa);
    }

    if (pedidoData.estado !== undefined) {
      fields.push(`estado = $${paramIndex}`);
      params.push(pedidoData.estado);
    }

    if (pedidoData.fecha_cierre !== undefined && pedidoData.estado === 'cerrado') {
      fields.push(`fecha_cierre = $${paramIndex}`);
      params.push(pedidoData.fecha_cierre);
    }

    if (fields.length === 0) {
      throw new ValidationError('No se proporcionaron campos para actualizar', 400);
    }

    fields.push(`WHERE id = $${paramIndex}`);
    params.push(id);

    const queryText = `UPDATE pedidos SET ${fields.join(', ')} RETURNING *`;

    const result = await query(queryText, params);

    if (result.rows.length === 0) {
      throw new ValidationError('Pedido no encontrado', 404);
    }

    return result.rows[0];
  }

  /**
   * Cerrar pedido
   * @param {number} id - ID del pedido
   * @returns {Object} - Pedido cerrado
   */
  async close(id) {
    const now = new Date();
    const result = await query(
      `UPDATE pedidos 
      SET estado = 'cerrado', fecha_cierre = $1
      WHERE id = $2
      RETURNING *`,
      [now, id]
    );

    if (result.rows.length === 0) {
      throw new ValidationError('Pedido no encontrado', 404);
    }

    return result.rows[0];
  }

  /**
   * Eliminar pedido (soft delete)
   * @param {number} id - ID del pedido
   * @returns {boolean} - Estado de la operación
   */
  async delete(id) {
    const result = await query(
      "UPDATE pedidos SET mesa = NULL WHERE id = $1",
      [id]
    );

    return result.rowCount > 0;
  }
}
