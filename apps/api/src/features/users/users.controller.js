const usersService = require('./users.service');
const createUser = async (req, res) => {
    const { nombre, email, password, rol_id } = req.body;
    if (!nombre || !email || !password) {
        return res.status(400).json({ message: 'Nombre, email y contraseña son requeridos' });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
    }
    try {
        const user = await usersService.createUser(nombre, email, password, rol_id);
        res.status(201).json(user);
    } catch (error) {
        if (error.message === 'EMAIL_ALREADY_EXISTS') {
            return res.status(409).json({ message: 'El email ya está registrado' });
        }
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
const getUsers = async (req, res) => {
    try {
        const users = await usersService.getUsers();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error getting users:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await usersService.getUserById(id);
        res.status(200).json(user);
    } catch (error) {
        if (error.message === 'USER_NOT_FOUND') {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        console.error('Error getting user:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { nombre, email, rol_id, activo } = req.body;
    try {
        const user = await usersService.updateUser(id, { nombre, email, rol_id, activo });
        res.status(200).json(user);
    } catch (error) {
        if (error.message === 'EMAIL_ALREADY_EXISTS') {
            return res.status(409).json({ message: 'El email ya está en uso por otro usuario' });
        }
        if (error.message === 'USER_NOT_FOUND') {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
const deactivateUser = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await usersService.deactivateUser(id);
        res.status(200).json(result);
    } catch (error) {
        if (error.message === 'USER_NOT_FOUND') {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        console.error('Error deactivating user:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
module.exports = {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deactivateUser
};