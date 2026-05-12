import { query } from '../config/db.js';
import { ValidationError } from '../utils/errors.js';

export class ProductoService {
  /**
   * Obtener todos los productos
   * @param {Object} filters - { activo, categoria_id, busqueda }
   * @returns {Array} - Lista de productos
   */
  async findAll(filters = {}) {
    let queryText = `
      SELECT 
        p.*,
        c.nombre as categoria_nombre
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.activo !== undefined) {
      queryText += ` AND p.activo = $${params.length + 1}`;
      params.push(filters.activo);
    }

    if (filters.categoria_id !== undefined) {
      queryText += ` AND p.categoria_id = $${params.length + 1}`;
      params.push(filters.categoria_id);
    }

    if (filters.busqueda) {
      queryText += ` AND (p.nombre ILIKE $${params.length + 1})`;
      params.push(`%${filters.busqueda}%`);
    }

    queryText += ' ORDER BY p.nombre';

    const result = await query(queryText, params);
    return result.rows;
  }

  /**
   * Obtener producto por ID
   * @param {number} id - ID del producto
   * @returns {Object} - Producto
   */
  async findById(id) {
    const result = await query(
      `SELECT 
        p.*,
        c.nombre as categoria_nombre
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      WHERE p.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      throw new ValidationError('Producto no encontrado', 404);
    }

    return result.rows[0];
  }

  /**
   * Crear nuevo producto
   * @param {Object} productData - Datos del producto
   * @returns {Object} - Producto creado
   */
  async create(productData) {
    const result = await query(
      `INSERT INTO productos (
        categoria_id, nombre, precio_venta, costo, stock_actual,
        stock_minimo, unidad, activo, stock
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id, categoria_id, nombre, precio_venta, costo,
        stock_actual, stock_minimo, unidad, activo, stock`,
      [
        productData.categoria_id,
        productData.nombre,
        productData.precio_venta,
        productData.costo,
        productData.stock_actual !== undefined ? productData.stock_actual : 0,
        productData.stock_minimo || 0,
        productData.unidad || 'unidad',
        productData.activo !== false,
        productData.stock || 0
      ]
    );

    return result.rows[0];
  }

  /**
   * Actualizar producto
   * @param {number} id - ID del producto
   * @param {Object} productData - Datos para actualizar
   * @returns {Object} - Producto actualizado
   */
  async update(id, productData) {
    const fields = [];
    const params = [];
    let paramIndex = 1;

    if (productData.nombre !== undefined) {
      fields.push(`nombre = $${paramIndex}`);
      params.push(productData.nombre);
    }

    if (productData.precio_venta !== undefined) {
      fields.push(`precio_venta = $${paramIndex}`);
      params.push(productData.precio_venta);
    }

    if (productData.costo !== undefined) {
      fields.push(`costo = $${paramIndex}`);
      params.push(productData.costo);
    }

    if (productData.stock_actual !== undefined) {
      fields.push(`stock_actual = $${paramIndex}`);
      params.push(productData.stock_actual);
    }

    if (productData.stock_minimo !== undefined) {
      fields.push(`stock_minimo = $${paramIndex}`);
      params.push(productData.stock_minimo);
    }

    if (productData.unidad !== undefined) {
      fields.push(`unidad = $${paramIndex}`);
      params.push(productData.unidad);
    }

    if (productData.activo !== undefined) {
      fields.push(`activo = $${paramIndex}`);
      params.push(productData.activo);
    }

    if (fields.length === 0) {
      throw new ValidationError('No se proporcionaron campos para actualizar', 400);
    }

    fields.push(`WHERE id = $${paramIndex}`);
    params.push(id);

    const queryText = `UPDATE productos SET ${fields.join(', ')} RETURNING *`;

    const result = await query(queryText, params);

    if (result.rows.length === 0) {
      throw new ValidationError('Producto no encontrado', 404);
    }

    return result.rows[0];
  }

  /**
   * Eliminar producto (soft delete)
   * @param {number} id - ID del producto
   * @returns {boolean} - Estado de la operación
   */
  async delete(id) {
    const result = await query(
      "UPDATE productos SET activo = false WHERE id = $1",
      [id]
    );

    return result.rowCount > 0;
  }

  /**
   * Calcular valor del stock
   * @param {number} productoId - ID del producto
   * @returns {Object} - Datos del valor de stock
   */
  async calcularValorStock(productoId) {
    const result = await query(
      `SELECT 
        stock_actual, 
        precio_venta, 
        (stock_actual * precio_venta) as valor_stock
      FROM productos 
      WHERE id = $1`,
      [productoId]
    );

    if (result.rows.length === 0) {
      throw new ValidationError('Producto no encontrado', 404);
    }

    return result.rows[0];
  }
}
