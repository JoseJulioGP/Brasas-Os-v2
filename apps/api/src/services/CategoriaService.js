import { query } from '../config/db.js';
import { ValidationError } from '../utils/errors.js';

export class CategoriaService {
  /**
   * Obtener todas las categorías
   * @returns {Array} - Lista de categorías
   */
  async findAll() {
    const result = await query(
      "SELECT * FROM categorias ORDER BY nombre",
      []
    );
    return result.rows;
  }

  /**
   * Obtener categoría por ID
   * @param {number} id - ID de la categoría
   * @returns {Object} - Categoría
   */
  async findById(id) {
    const result = await query(
      "SELECT * FROM categorias WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      throw new ValidationError('Categoría no encontrada', 404);
    }

    return result.rows[0];
  }

  /**
   * Crear nueva categoría
   * @param {Object} categoriaData - { nombre }
   * @returns {Object} - Categoría creada
   */
  async create(categoriaData) {
    const result = await query(
      `INSERT INTO categorias (nombre)
      VALUES ($1)
      RETURNING id, nombre`,
      [categoriaData.nombre]
    );

    if (result.rows.length === 0) {
      throw new ValidationError('Error al crear la categoría', 500);
    }

    return result.rows[0];
  }

  /**
   * Actualizar categoría
   * @param {number} id - ID de la categoría
   * @param {Object} categoriaData - { nombre }
   * @returns {Object} - Categoría actualizada
   */
  async update(id, categoriaData) {
    const fields = [];
    const params = [];
    let paramIndex = 1;

    if (categoriaData.nombre !== undefined) {
      fields.push(`nombre = $${paramIndex}`);
      params.push(categoriaData.nombre);
    }

    if (fields.length === 0) {
      throw new ValidationError('No se proporcionaron campos para actualizar', 400);
    }

    fields.push(`WHERE id = $${paramIndex}`);
    params.push(id);

    const queryText = `UPDATE categorias SET ${fields.join(', ')} RETURNING *`;

    const result = await query(queryText, params);

    if (result.rows.length === 0) {
      throw new ValidationError('Categoría no encontrada', 404);
    }

    return result.rows[0];
  }

  /**
   * Eliminar categoría (soft delete)
   * @param {number} id - ID de la categoría
   * @returns {boolean} - Estado de la operación
   */
  async delete(id) {
    // No permitir eliminar categorías con productos
    const count = await query(
      "SELECT COUNT(*) as count FROM productos WHERE categoria_id = $1",
      [id]
    );

    if (count.rows[0].count > 0) {
      throw new ValidationError('No se puede eliminar una categoría con productos', 400);
    }

    const result = await query(
      "UPDATE categorias SET nombre = '' WHERE id = $1",
      [id]
    );

    return result.rowCount > 0;
  }
}
