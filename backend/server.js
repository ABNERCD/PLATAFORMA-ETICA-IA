import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // ¡Importante para conectar frontend y backend!
import { testConnection } from './config/database.js'; // Importa la prueba de conexión

// Importar tus rutas
import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js'; // (Cuando las tengas)

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001; // Elige un puerto para el backend

// --- Middlewares Esenciales ---

// 1. CORS: Permite que tu frontend (en localhost:5173) hable con tu backend (en localhost:3001)
app.use(cors()); 

// 2. Express JSON: Permite que el backend entienda los JSON que envía el frontend
app.use(express.json());

// --- Rutas de tu API ---
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor de backend corriendo en http://localhost:${PORT}`);
  // Probar la conexión a la BD al iniciar
  testConnection();
});