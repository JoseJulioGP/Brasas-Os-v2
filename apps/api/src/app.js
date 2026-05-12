const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const app = express();
// Middlewares globales
app.use(helmet());
app.use(express.json());
// Configuración de CORS basada en entorno
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://tudominio.com' 
    : 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));
// Rutas del API - Screaming Architecture
app.use('/api/v1/auth', require('./features/auth/routes'));
app.use('/api/v1/usuarios', require('./features/users/users.routes'));
app.use('/api/v1/productos', require('./features/productos/productos.routes'));
app.use('/api/v1/inventario', require('./features/inventario/inventario.routes'));
app.use('/api/v1/pedidos', require('./features/pedidos/pedidos.routes'));
module.exports = app;