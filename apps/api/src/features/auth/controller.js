const authService = require('./service');

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email y contraseña son requeridos' });
  }

  try {
    const { token, user } = await authService.login(email, password);
    return res.status(200).json({ token, user });
  } catch (error) {
    if (error.message === 'CREDENTIALS_INVALID') {
      return res.status(401).json({ message: 'Email o contraseña incorrectos' });
    }
    if (error.message === 'USER_INACTIVE') {
      return res.status(403).json({ message: 'Usuario inactivo' });
    }
    console.error('Error en login:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const register = async (req, res) => {
  const { nombre, email, password, local_id } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ message: 'Nombre, email y contraseña son requeridos' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
  }

  try {
    const { token, user } = await authService.register({ nombre, email, password, local_id });
    return res.status(201).json({ token, user });
  } catch (error) {
    if (error.message === 'EMAIL_EXISTS') {
      return res.status(409).json({ message: 'El email ya está registrado' });
    }
    if (error.message === 'ROLE_NOT_FOUND') {
      return res.status(500).json({ message: 'Rol jefe no encontrado en la base de datos' });
    }
    console.error('Error en registro:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const me = (req, res) => {
  return res.status(200).json({ user: req.user });
};

module.exports = { login, register, me };
