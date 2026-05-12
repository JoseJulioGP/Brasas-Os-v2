const express = require('express');
const cors = require('cors');
const helmet = require('helmet'); // Para seguridad HTTP
require('dotenv').config();

const app = express();

// Middlewares globales
app.use(helmet()); // Protege cabeceras
app.use(express.json()); // Permite recibir JSON en el body

// Configuración de CORS basada en entorno
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://tudominio.com' 
    : 'http://localhost:5173', // El puerto donde corre tu React
  credentials: true, // Vital si vas a manejar sesiones o cookies (JWT)
};
app.use(cors(corsOptions));

// Rutas de ejemplo
app.use('/api/v1/usuarios', require('./routes/usuarios'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor de Brasas-OS corriendo en el puerto ${PORT}`);
});