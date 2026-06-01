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
  max: 10, // Máximo de conexiones simultáneas
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000, // 10s para tolerar latencia de Supabase
});

// Prueba de fuego: Verificar la conexión al iniciar
pool.connect((err, client, release) => {
  if (err) {
    return console.error('❌ Error de conexión en Brasas-OS:', err.stack);
  }
  client.query('SELECT NOW()', (err, result) => {
    release(); // Liberar la conexión de vuelta al pool
    if (err) {
      return console.error('❌ Error ejecutando query inicial:', err.stack);
    }
    console.log('✅ Brasas-OS conectado a Supabase con éxito en el puerto', process.env.DB_PORT);
  });
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  connect: () => pool.connect(),
  pool
};