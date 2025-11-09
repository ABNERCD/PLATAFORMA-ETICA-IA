const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);

// Ruta de prueba
app.get('/api', (req, res) => {
  res.json({ 
    success: true, 
    message: '🚀 API de Plataforma Ética en IA funcionando correctamente',
    version: '1.0.0'
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Ruta no encontrada' 
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    success: false, 
    message: 'Error interno del servidor' 
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║  🚀 Servidor Backend Iniciado             ║
║  📡 Puerto: ${PORT}                         ║
║  🌐 URL: http://localhost:${PORT}          ║
║  📚 API Docs: http://localhost:${PORT}/api ║
╚════════════════════════════════════════════╝
  `);
});