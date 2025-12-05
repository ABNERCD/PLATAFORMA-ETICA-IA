import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

/**
 * Middleware para proteger rutas.
 * Verifica el token JWT y añade el usuario (ej. su ID) al objeto 'req'.
 */
export const protect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 1. Obtener el token del header
      token = req.headers.authorization.split(' ')[1];

      // 2. Verificar el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Obtener el usuario de la BD (sin el password) y adjuntarlo a 'req'
      // Esto nos da 'req.user' en la siguiente función (el controlador)
      const [users] = await pool.query('SELECT usuario_id, nombre, email, rol FROM usuarios WHERE usuario_id = ?', [decoded.id]);
      
      if (users.length === 0) {
        return res.status(401).json({ message: 'Usuario no encontrado, token falló' });
      }
      
      req.user = users[0];
      next(); // Continúa al siguiente middleware o controlador

    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'No autorizado, token falló' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'No autorizado, no hay token' });
  }
};

/**
 * Middleware (Opcional) para verificar si es admin o instructor
 */
export const isInstructor = (req, res, next) => {
  if (req.user && (req.user.rol === 'instructor' || req.user.rol === 'administrador')) {
    next();
  } else {
    res.status(403).json({ message: 'Acceso denegado, requiere rol de instructor' });
  }
};