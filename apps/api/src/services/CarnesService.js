import { query } from '../config/db.js';
import { ValidationError } from '../utils/errors.js';

export class CarnesService {
  /**
   * Obtener todos los cortes de carne
   * @param {Object} filters - { busqueda }
   * @returns {Array} - Lista de carnes
   */
  async findAll(filters = {}) {
    let queryText = `
      SELECT * FROM carnes
      WHERE 1=1
    `;
    const params = [];

    if (filters.busqueda) {
      queryText += ` AND nombre_corte ILIKE $${params.length + 1}`;
      params.push(`%${filters.busqueda}%`);
    }

    queryText += ' ORDER BY nombre_corte';

    const result = await query(queryText, params);
    return result.rows;
  }

  /**
   * Obtener carne por ID
   * @param {number} id - ID de la carne
   * @returns {Object} - Carne
   */
  async findById(id) {
    const result = await query(
      "SELECT * FROM carnes WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      throw new ValidationError('Corte de carne no encontrado', 404);
    }

    return result.rows[0];
  }

  /**
   * Crear nuevo corte de carne
   * @param {Object} carneData - { nombre_corte, precio_kg }
   * @returns {Object} - Carne creada
   */
  async create(carneData) {
    const result = await query(
      `INSERT INTO carnes (nombre_corte, precio_kg)
      VALUES ($1, $2)
      RETURNING id, nombre_corte, precio_kg`,
      [carneData.nombre_corte, carneData.precio_kg]
    );

    if (result.rows.length === 0) {
      throw new ValidationError('Error al crear el corte de carne', 500);
    }

    return result.rows[0];
  }

  /**
   * Actualizar carne
   * @param {number} id - ID de la carne
   * @param {Object} carneData - Datos para actualizar
   * @returns {Object} - Carne actualizada
   */
  async update(id, carneData) {
    const fields = [];
    const params = [];
    let paramIndex = 1;

    if (carneData.nombre_corte !== undefined) {
      fields.push(`nombre_corte = $${paramIndex}`);
      params.push(carneData.nombre_corte);
    }

    if (carneData.precio_kg !== undefined) {
      fields.push(`precio_kg = $${paramIndex}`);
      params.push(carneData.precio_kg);
    }

    if (fields.length === 0) {
      throw new ValidationError('No se proporcionaron campos para actualizar', 400);
    }

    fields.push(`WHERE id = $${paramIndex}`);
    params.push(id);

    const queryText = `UPDATE carnes SET ${fields.join(', ')} RETURNING *`;

    const result = await query(queryText, params);

    if (result.rows.length === 0) {
      throw new ValidationError('Corte de carne no encontrado', 404);
    }

    return result.rows[0];
  }

  /**
   * Eliminar carne (soft delete)
   * @param {number} id - ID de la carne
   * @returns {boolean} - Estado de la operación
   */
  async delete(id) {
    const result = await query(
      "UPDATE carnes SET nombre_corte = '' WHERE id = $1",
      [id]
    );

    return result.rowCount > 0;
  }

  /**
   * Obtener corte de carne con su inventario disponible
   * @param {number} carneId - ID de la carne
   * @returns {Object} - Carne con inventario
   */
  async getWithInventory(carneId) {
    const result = await query(
      `SELECT 
        c.*,
        i.kg_disponibles,
        i.kg_usados
      FROM carnes c
      LEFT JOIN inventario_carnes i ON c.id = i.carne_id
      WHERE c.id = $1`,
      [carneId]
    );

    if (result.rows.length === 0) {
      throw new ValidationError('Corte de carne no encontrado', 404);
    }

    return result.rows[0];
  }
}
