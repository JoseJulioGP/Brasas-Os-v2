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
        
        // Verificar inactividad (30 minutos)
        const tokenAge = Date.now() - decoded.iat;
        const thirtyMinutes = 30 * 60 * 1000;
        
        if (tokenAge >= thirtyMinutes) {
            return res.status(401).json({ 
                message: 'Sesión expirada por inactividad',
                code: 'SESSION_TIMEOUT'
            });
        }
        
        // Actualizar iat para extender la sesión automáticamente
        decoded.iat = Date.now();
        req.newToken = jwt.sign(
            { id: decoded.id, rol: decoded.rol, email: decoded.email, iat: decoded.iat },
            process.env.JWT_SECRET,
            { expiresIn: '30m' }
        );
        
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
        
        if (req.user.rol !== roleNeeded) {
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
        
        if (!allowedRoles.includes(req.user.rol)) {
            return res.status(403).json({ message: 'Acceso denegado. Permisos insuficientes.' });
        }
        
        next();
    };
};

module.exports = { verifyToken, requireRole, requireAnyRole };