const jwt = require('jsonwebtoken');

/**
 * Auth Middleware - SRP: Solo verificación de autenticación y roles
 * JWT es stateless - no requiere tabla sesiones
 */

/**
 * verifyToken - Verifica que el JWT sea válido
 * No necesita consultar la BD (stateless)
 */
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        decoded.lastActivity = Date.now();
        // Normalizar rol a mayúsculas para comparaciones consistentes
        if (decoded.rol) decoded.rol = decoded.rol.toUpperCase();
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: 'Token expirado',
                code: 'TOKEN_EXPIRED'
            });
        }
        return res.status(401).json({ message: 'Token inválido o expirado.' });
    }
};

/**
 * requireRole - Verifica que el usuario tenga el rol requerido
 */
const requireRole = (roleNeeded) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Usuario no autenticado.' });
        }

        const userRol = (req.user.rol || '').toUpperCase();
        if (userRol !== roleNeeded.toUpperCase()) {
            return res.status(403).json({ message: 'Acceso denegado. Permisos insuficientes.' });
        }

        next();
    };
};

/**
 * requireAnyRole - Verifica que el usuario tenga al menos uno de los roles permitidos
 */
const requireAnyRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Usuario no autenticado.' });
        }

        const userRol = (req.user.rol || '').toUpperCase();
        if (!allowedRoles.map(r => r.toUpperCase()).includes(userRol)) {
            return res.status(403).json({ message: 'Acceso denegado. Permisos insuficientes.' });
        }

        next();
    };
};

module.exports = { verifyToken, requireRole, requireAnyRole };