import pool from '../config/database.js'; // Importa la conexión
import bcrypt from 'bcryptjs'; // Para comparar contraseñas
import jwt from 'jsonwebtoken'; // Para crear el token
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

// Función de Registro (La necesitarás pronto)
export const register = async (req, res) => {
  const { nombre, email, password } = req.body;

  try {
    // 1. Verificar si el usuario ya existe
    const [userExists] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (userExists.length > 0) {
      return res.status(400).json({ success: false, message: 'El correo ya está registrado' });
    }

    // 2. Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Insertar en la BD
    const [newUser] = await pool.query(
      'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
      [nombre, email, hashedPassword]
    );

    // (Opcional) Crear token al registrar
    const token = jwt.sign({ id: newUser.insertId }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({
      success: true,
      message: 'Usuario registrado con éxito',
      token
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
};


// --- Función de LOGIN (La que quieres probar) ---
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Buscar al usuario por email
    const [users] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);

    // 2. Si no existe, enviar error
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    const user = users[0];

    // 3. Comparar la contraseña del formulario con la hasheada de la BD
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Credenciales inválidas' });
    }

    // 4. Si todo es correcto, crear un Token (JWT)
    const token = jwt.sign(
      { id: user.usuario_id, rol: user.rol }, // Info que guardas en el token
      process.env.JWT_SECRET, // Necesitas una clave secreta en tu .env
      { expiresIn: '1h' } // El token expira en 1 hora
    );

    // 5. Enviar la respuesta exitosa
    res.json({
      success: true,
      message: '¡Bienvenido de nuevo!',
      token: token,
      user: { // Enviamos los datos del usuario (sin el password)
        id: user.usuario_id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol
      }
    });

  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
};