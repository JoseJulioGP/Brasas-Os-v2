const jwt = require('jsonwebtoken');
const db = require('../database/db');
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido o expirado.' });
    }
};
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
const checkSessionActivity = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });
        const tokenAge = Date.now() - decoded.iat;
        const thirtyMinutes = 30 * 60 * 1000;
        if (tokenAge >= thirtyMinutes) {
            await db.query('DELETE FROM sesiones WHERE token = $1', [token]);
            return res.status(401).json({
                message: 'Sesión expirada por inactividad',
                code: 'SESSION_TIMEOUT'
            });
        }
        const sessionCheck = await db.query(
            'SELECT id FROM sesiones WHERE token = $1 AND expira_en > NOW()',
            [token]
        );
        if (sessionCheck.rows.length === 0) {
            return res.status(401).json({
                message: 'Sesión inválida o expirada',
                code: 'SESSION_INVALID'
            });
        }
        await db.query(
            'UPDATE sesiones SET expira_en = NOW() + INTERVAL \'30 minutes\' WHERE token = $1',
            [token]
        );
        decoded.iat = Date.now();
        req.newToken = jwt.sign(
            { id: decoded.id, rol: decoded.rol, iat: decoded.iat },
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
        return res.status(401).json({ message: 'Token inválido.' });
    }
};
const extendSession = async (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(400).json({ message: 'Token requerido' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });
        await db.query(
            'UPDATE sesiones SET expira_en = NOW() + INTERVAL \'30 minutes\' WHERE token = $1',
            [token]
        );
        const newToken = jwt.sign(
            { id: decoded.id, rol: decoded.rol, iat: Date.now() },
            process.env.JWT_SECRET,
            { expiresIn: '30m' }
        );
        res.status(200).json({
            token: newToken,
            message: 'Sesión extendida por 30 minutos'
        });
    } catch (error) {
        res.status(401).json({ message: 'No se pudo extender la sesión' });
    }
};
module.exports = { verifyToken, requireRole, checkSessionActivity, extendSession };