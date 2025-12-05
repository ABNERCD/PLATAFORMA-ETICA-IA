import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; 
import { testConnection } from './config/database.js';

// --- NUEVOS IMPORTS (Necesarios para manejar rutas de archivos) ---
import path from 'path';
import { fileURLToPath } from 'url';

// Importar tus rutas
import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js';

// --- CONFIGURACIÓN DE RUTAS (Para que funcione __dirname) ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
dotenv.config();

const app = express();
// Nota: Es mejor usar el puerto 5000 para evitar conflictos con React, 
// pero si usas 3001 asegúrate de que tu frontend apunte ahí.
const PORT = process.env.PORT || 5000; 

// --- Middlewares Esenciales ---

app.use(cors()); 
app.use(express.json());

// --- ¡ESTO ES LO QUE ARREGLA EL VISOR DE ARCHIVOS! ---
// Le dice al servidor: "Si alguien pide algo en /uploads, busca en la carpeta física uploads"
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Rutas de tu API ---
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor de backend corriendo en http://localhost:${PORT}`);
  testConnection();
});