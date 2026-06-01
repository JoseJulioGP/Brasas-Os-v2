const db = require('../../shared/database/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const historialService = require('../historial/historial.service');
const { TIPOS_ACCION, ENTIDADES } = require('../../shared/constants/audit');

const EXPIRES_IN = '8h';

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: EXPIRES_IN });
}

class AuthService {
  async login(email, password) {
    const sql = `
      SELECT u.id, u.nombre, u.email, u.password_hash, u.activo, u.local_id,
             r.id AS rol_id, r.nombre AS rol_nombre, r.permisos
      FROM usuarios u
      JOIN roles r ON u.rol_id = r.id
      WHERE u.email = $1
    `;
    const result = await db.query(sql, [email]);
    const usuario = result.rows[0];

    if (!usuario) throw new Error('CREDENTIALS_INVALID');
    if (!usuario.activo) throw new Error('USER_INACTIVE');

    const passwordValida = await bcrypt.compare(password, usuario.password_hash);
    if (!passwordValida) throw new Error('CREDENTIALS_INVALID');

    await db.query(
      'UPDATE usuarios SET ultimo_acceso = NOW() WHERE id = $1',
      [usuario.id]
    );

    const user = {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol_nombre,
      permisos: usuario.permisos,
      local_id: usuario.local_id,
    };

    const token = signToken({ id: user.id, rol: user.rol, rol_id: usuario.rol_id, email: user.email });

    historialService.registrar({
      usuario_id:  usuario.id,
      rol_id:      usuario.rol_id,
      tipo_accion: TIPOS_ACCION.LOGIN,
      entidad:     ENTIDADES.AUTH,
      entidad_id:  usuario.id,
      descripcion: `LOGIN de ${usuario.email}`,
    }).catch(() => {});

    return { token, user };
  }

  async register({ nombre, email, password, local_id = null }) {
    const emailExistente = await db.query(
      'SELECT id FROM usuarios WHERE email = $1',
      [email]
    );
    if (emailExistente.rows.length > 0) throw new Error('EMAIL_EXISTS');

    const rolResult = await db.query(
      "SELECT id FROM roles WHERE nombre = 'jefe'"
    );
    if (rolResult.rows.length === 0) throw new Error('ROLE_NOT_FOUND');
    const rol_id = rolResult.rows[0].id;

    const password_hash = await bcrypt.hash(password, 10);

    const insert = await db.query(
      `INSERT INTO usuarios (local_id, rol_id, nombre, email, password_hash, activo, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, true, NOW(), NOW())
       RETURNING id, nombre, email, local_id`,
      [local_id, rol_id, nombre, email, password_hash]
    );

    const user = {
      id: insert.rows[0].id,
      nombre: insert.rows[0].nombre,
      email: insert.rows[0].email,
      rol: 'jefe',
      local_id: insert.rows[0].local_id,
    };

    const token = signToken({ id: user.id, rol: user.rol, rol_id, email: user.email });

    return { token, user };
  }
}

module.exports = new AuthService();
