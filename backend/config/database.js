import { createPool } from 'mysql2/promise';
import dotenv from 'dotenv';

// Asegúrate que la ruta al .env sea correcta
// Si .env está en la carpeta 'backend', la ruta es solo './.env'
// Si .env está en la raíz (PLATAFORMA-ETICA-IA), la ruta es '../.env'
dotenv.config({ path: './.env' }); // Prueba cambiando a './.env' si .env está en /backend

const pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// --- EXPORTACIÓN NOMBRADA ---
// Esto es lo que tu 'server.js' necesita (con llaves)
export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conexión a la BD de MySQL exitosa.');
    connection.release();
  } catch (error) {
    console.error('❌ Error al conectar con la BD:', error);
    process.exit(1); // Detiene la app si no se puede conectar
  }
};

// --- EXPORTACIÓN POR DEFECTO ---
// Esto es lo que tu 'authController.js' necesita (sin llaves)
export default pool;