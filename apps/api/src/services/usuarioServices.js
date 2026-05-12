import { query } from '../config/db.js';
import { ValidationError } from '../utils/errors.js';

export class UsuarioService {
  /**
   * Obtener todos los usuarios
   * @param {Object} filters - { activo, rol_id, busqueda }
   * @returns {Array} - Lista de usuarios
   */
  async findAll(filters = {}) {
    let queryText = `
      SELECT * FROM usuarios
      WHERE 1=1
    `;
    const params = [];

    if (filters.activo !== undefined) {
      queryText += ` AND activo = $${params.length + 1}`;
      params.push(filters.activo);
    }

    if (filters.rol_id !== undefined) {
      queryText += ` AND rol_id = $${params.length + 1}`;
      params.push(filters.rol_id);
    }

    if (filters.busqueda) {
      queryText += ` AND (nombre ILIKE $${params.length + 1} OR email ILIKE $${params.length + 1})`;
      params.push(`%${filters.busqueda}%`);
    }

    queryText += ' ORDER BY nombre';

    const result = await query(queryText, params);
    return result.rows;
  }

  /**
   * Obtener un usuario por ID
   * @param {number} id - ID del usuario
   * @returns {Object} - Usuario
   */
  async findById(id) {
    const result = await query(
      "SELECT * FROM usuarios WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      throw new ValidationError('Usuario no encontrado', 404);
    }

    return result.rows[0];
  }

  /**
   * Crear nuevo usuario
   * @param {Object} userData - { nombre, email, password, rol_id }
   * @returns {Object} - Usuario creado
   */
  async create(userData) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    const result = await query(
      `INSERT INTO usuarios (
        nombre, email, password_hash, rol_id, activo
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING id, nombre, email, activo, rol_id`,
      [
        userData.nombre,
        userData.email,
        hashedPassword,
        userData.rol_id || 1,
        userData.activo !== false
      ]
    );

    return result.rows[0];
  }

  /**
   * Actualizar usuario
   * @param {number} id - ID del usuario
   * @param {Object} userData - Datos para actualizar
   * @returns {Object} - Usuario actualizado
   */
  async update(id, userData) {
    const { password, ...updateData } = userData;

    // Si se proporcionó una nueva contraseña, encriptarla
    if (password) {
      const saltRounds = 10;
      updateData.password_hash = await bcrypt.hash(password, saltRounds);
      delete userData.password;
    }

    const result = await query(
      `UPDATE usuarios
      SET nombre = $1, email = $2, activo = $3
      WHERE id = $4
      RETURNING id, nombre, email, activo, rol_id`,
      [
        updateData.nombre,
        updateData.email,
        updateData.activo,
        id
      ]
    );

    if (result.rows.length === 0) {
      throw new ValidationError('Usuario no encontrado', 404);
    }

    return result.rows[0];
  }

  /**
   * Eliminar usuario (soft delete)
   * @param {number} id - ID del usuario
   * @returns {boolean} - Estado de la operación
   */
  async delete(id) {
    const result = await query(
      "UPDATE usuarios SET activo = false WHERE id = $1",
      [id]
    );

    return result.rowCount > 0;
  }
}
