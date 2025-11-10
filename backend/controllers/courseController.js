import pool from '../config/database.js';

// 1. Crear un nuevo curso
export const createCourse = async (req, res) => {
  const { titulo, descripcion } = req.body;
  // Gracias al middleware 'protect', ya tenemos 'req.user'
  const instructor_id = req.user.usuario_id;

  try {
    const [result] = await pool.query(
      'INSERT INTO cursos (titulo, descripcion, instructor_id) VALUES (?, ?, ?)',
      [titulo, descripcion, instructor_id]
    );
    
    res.status(201).json({ 
      success: true, 
      message: 'Curso creado con éxito',
      curso_id: result.insertId 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al crear el curso' });
  }
};

// 2. Añadir una lección a un curso
export const addLesson = async (req, res) => {
  const { curso_id } = req.params;
  const { titulo, tipo, contenido_texto } = req.body;

  try {
    let contenidoFinal = '';
    
    if (tipo === 'video') {
      // Si es video, guardamos la URL (ej. de YouTube) que vino en el body
      contenidoFinal = contenido_texto;
    } else if (tipo === 'archivo' && req.file) {
      // Si es archivo, guardamos la ruta del archivo que subió multer
      // Hacemos la ruta accesible, ej: '/uploads/archivo-1234.pdf'
      contenidoFinal = `/${req.file.path}`; 
    } else if (tipo === 'texto') {
      // Si es solo texto
      contenidoFinal = contenido_texto;
    }

    const [result] = await pool.query(
      'INSERT INTO lecciones (curso_id, titulo, contenido, tipo) VALUES (?, ?, ?, ?)',
      [curso_id, titulo, contenidoFinal, tipo] // Asumo que añadiste la columna 'tipo'
    );
    
    res.status(201).json({
      success: true,
      message: 'Lección añadida con éxito',
      leccion_id: result.insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al añadir lección' });
  }
};

// 3. Obtener todos los cursos
export const getAllCourses = async (req, res) => {
  try {
    const [cursos] = await pool.query(
      'SELECT c.curso_id, c.titulo, c.descripcion, u.nombre AS instructor FROM cursos c JOIN usuarios u ON c.instructor_id = u.usuario_id WHERE c.publicado = 1'
    );
    res.json(cursos);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};
// 4. Inscribir un usuario (estudiante) a un curso
export const enrollInCourse = async (req, res) => {
  try {
    // Obtenemos el ID del curso desde los parámetros de la URL
    const { curso_id } = req.params;
    
    // Obtenemos el ID del usuario (estudiante) desde el token (gracias al middleware 'protect')
    const { usuario_id } = req.user;

    // Insertamos el nuevo registro en la tabla pivote 'inscripciones'
    const [result] = await pool.query(
      'INSERT INTO inscripciones (usuario_id, curso_id) VALUES (?, ?)',
      [usuario_id, curso_id]
    );

    res.status(201).json({
      success: true,
      message: '¡Inscripción exitosa!',
      inscripcion_id: result.insertId
    });

  } catch (error) {
    // Manejamos el error más común: "ya estás inscrito"
    if (error.code === 'ER_DUP_ENTRY') { // ER_DUP_ENTRY (código 1062) es por la restricción UNIQUE
      return res.status(400).json({ success: false, message: 'Ya estás inscrito en este curso.' });
    }
    
    console.error(error);
    res.status(500).json({ success: false, message: 'Error en el servidor al inscribirse.' });
  }
};