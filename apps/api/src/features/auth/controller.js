const authService = require('./service');
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email y contraseña son requeridos' });
    }
    try {
        const result = await authService.login(email, password);
        res.status(200).json(result);
    } catch (error) {
        if (error.message === 'CREDENTIALS_INVALID') {
            return res.status(401).json({ message: 'Email o contraseña incorrectos' });
        }
        console.error('Error en login:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
const register = async (req, res) => {
    const { nombre, email, password } = req.body;
    if (!nombre || !email || !password) {
        return res.status(400).json({ 
            message: 'Nombre, email y contraseña son requeridos' 
        });
    }
    if (password.length < 6) {
        return res.status(400).json({ 
            message: 'La contraseña debe tener al menos 6 caracteres' 
        });
    }
    try {
        const result = await authService.register(nombre, email, password);
        res.status(201).json(result);
    } catch (error) {
        if (error.message === 'EMAIL_ALREADY_EXISTS') {
            return res.status(409).json({ message: 'El email ya está registrado' });
        }
        console.error('Error en registro:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
const me = (req, res) => {
    res.status(200).json({ user: req.user });
};

module.exports = { login, register, me };