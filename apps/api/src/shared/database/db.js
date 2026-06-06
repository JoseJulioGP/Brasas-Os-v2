const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false // Obligatorio para Supabase
  },
  // Configuración de optimización para Brasas-OS
  max: 3,                    // Supabase free tier: máximo 15 conexiones totales
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 15000,
});

// Verificar conexión al iniciar con reintentos automáticos
const verificarConexion = (intento = 1) => {
  pool.connect((err, client, release) => {
    if (err) {
      console.warn(`⏳ Supabase no responde (intento ${intento}) — reintentando en 5s...`);
      setTimeout(() => verificarConexion(intento + 1), 5000);
      return;
    }
    client.query('SELECT NOW()', (err) => {
      release();
      if (err) {
        console.warn(`⏳ Query inicial falló (intento ${intento}) — reintentando en 5s...`);
        setTimeout(() => verificarConexion(intento + 1), 5000);
        return;
      }
      console.log('✅ Brasas-OS conectado a Supabase con éxito en el puerto', process.env.DB_PORT);
    });
  });
};
verificarConexion();

module.exports = {
  query: (text, params) => pool.query(text, params),
  connect: () => pool.connect(),
  pool
};