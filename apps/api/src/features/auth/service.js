const db = require('../../shared/database/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
class AuthService {
    async login(email, password) {
        const userQuery = `
        SELECT u.*, r.nombre as rol_nombre 
        FROM usuarios u 
        JOIN roles r ON u.rol_id = r.id 
        WHERE u.email = $1 AND u.activo = true
    `;
        const { rows } = await db.query(userQuery, [email]);

        if (rows.length === 0) {
            throw new Error('CREDENTIALS_INVALID');
        }
        const user = rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            throw new Error('CREDENTIALS_INVALID');
        }
        const token = jwt.sign(
            { id: user.id, rol: user.rol_nombre, iat: Date.now() },
            process.env.JWT_SECRET,
            { expiresIn: '30m' }
        );
        await db.query(
            `INSERT INTO sesiones (usuario_id, token, expira_en, creado_at)
        VALUES ($1, $2, NOW() + INTERVAL '30 minutes', NOW())`,
            [user.id, token]
        );
        return {
            token,
            user: {
                id: user.id,
                nombre: user.nombre,
                email: user.email,
                rol: user.rol_nombre
            }
        };
    }
    async register(nombre, email, password) {
        const existingUser = await db.query(
            'SELECT id FROM usuarios WHERE email = $1',
            [email]
        );

        if (existingUser.rows.length > 0) {
            throw new Error('EMAIL_ALREADY_EXISTS');
        }
        const password_hash = await bcrypt.hash(password, 10);
        const rolResult = await db.query(
            "SELECT id FROM roles WHERE nombre = 'EMPLEADO'"
        );
        const rol_id = rolResult.rows[0]?.id || 3;
        const result = await db.query(
            `INSERT INTO usuarios (nombre, email, password_hash, rol_id, activo, creado_at)
        VALUES ($1, $2, $3, $4, true, NOW())
        RETURNING id, nombre, email, rol_id, activo`,
            [nombre, email, password_hash, rol_id]
        );
        const user = result.rows[0];
        user.rol_nombre = 'EMPLEADO';
        const token = jwt.sign(
            { id: user.id, rol: user.rol_nombre, iat: Date.now() },
            process.env.JWT_SECRET,
            { expiresIn: '30m' }
        );
        await db.query(
            `INSERT INTO sesiones (usuario_id, token, expira_en, creado_at)
        VALUES ($1, $2, NOW() + INTERVAL '30 minutes', NOW())`,
            [user.id, token]
        );
        return {
            token,
            user: {
                id: user.id,
                nombre: user.nombre,
                email: user.email,
                rol: user.rol_nombre
            }
        };
    }
}
module.exports = new AuthService();