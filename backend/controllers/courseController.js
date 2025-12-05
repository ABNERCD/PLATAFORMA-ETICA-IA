import pool from '../config/database.js';

// 1. Crear un nuevo curso (Admin)
export const createCourse = async (req, res) => {
  const { titulo, descripcion } = req.body;
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

// 2. Añadir una lección a un curso (Admin)
export const addLesson = async (req, res) => {
  const { curso_id } = req.params;
  const { titulo, tipo, contenido_texto } = req.body;

  try {
    let contenidoFinal = '';
    
    if (tipo === 'video') {
      contenidoFinal = contenido_texto; // URL de YouTube
    } else if (tipo === 'archivo' && req.file) {
      // Corrección para Windows: Cambiar backslashes a slashes normales
      const cleanPath = req.file.path.replace(/\\/g, '/');
      contenidoFinal = `/${cleanPath}`; 
    } else if (tipo === 'texto') {
      contenidoFinal = contenido_texto;
    }

    const [result] = await pool.query(
      'INSERT INTO lecciones (curso_id, titulo, contenido, tipo) VALUES (?, ?, ?, ?)',
      [curso_id, titulo, contenidoFinal, tipo]
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

// 3. Obtener todos los cursos publicados (Público)
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

// 4. Inscribir un usuario a un curso (Estudiante)
export const enrollInCourse = async (req, res) => {
  try {
    const { curso_id } = req.params;
    const { usuario_id } = req.user;

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
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, message: 'Ya estás inscrito en este curso.' });
    }
    console.error(error);
    res.status(500).json({ success: false, message: 'Error en el servidor al inscribirse.' });
  }
};

// 5. Obtener detalles del curso y lecciones con progreso (Estudiante)
export const getCourseDetails = async (req, res) => {
  const { curso_id } = req.params;
  const { usuario_id } = req.user;

  try {
    // A. Verificar si está inscrito
    const [inscripcion] = await pool.query(
      'SELECT * FROM inscripciones WHERE usuario_id = ? AND curso_id = ?',
      [usuario_id, curso_id]
    );

    if (inscripcion.length === 0) {
      return res.status(403).json({ message: 'No estás inscrito en este curso.' });
    }

    // B. Obtener info del curso
    const [curso] = await pool.query('SELECT * FROM cursos WHERE curso_id = ?', [curso_id]);

    // C. Obtener lecciones con estado de completado
    const [lecciones] = await pool.query(`
      SELECT l.*, 
             CASE WHEN p.completado = 1 THEN true ELSE false END as completada
      FROM lecciones l 
      LEFT JOIN progreso_usuario p ON l.leccion_id = p.leccion_id AND p.usuario_id = ?
      WHERE l.curso_id = ?
      ORDER BY l.leccion_id ASC
    `, [usuario_id, curso_id]);

    res.json({
      curso: curso[0],
      lecciones: lecciones
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el curso' });
  }
};

// 6. Marcar/Desmarcar lección como completada (Estudiante)
export const toggleLessonProgress = async (req, res) => {
  const { curso_id, leccion_id } = req.params;
  const { usuario_id } = req.user;

  try {
    const [existing] = await pool.query(
      'SELECT * FROM progreso_usuario WHERE usuario_id = ? AND leccion_id = ?',
      [usuario_id, leccion_id]
    );

    let nuevoEstado = false;

    if (existing.length > 0) {
      // Desmarcar (borrar)
      await pool.query(
        'DELETE FROM progreso_usuario WHERE usuario_id = ? AND leccion_id = ?',
        [usuario_id, leccion_id]
      );
      nuevoEstado = false;
    } else {
      // Marcar como visto
      await pool.query(
        'INSERT INTO progreso_usuario (usuario_id, leccion_id, completado, fecha_completado) VALUES (?, ?, 1, NOW())',
        [usuario_id, leccion_id]
      );
      nuevoEstado = true;
    }

    res.json({ success: true, completada: nuevoEstado });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar progreso' });
  }
};

// 7. Obtener IDs de cursos inscritos (Estudiante - Para Dashboard)
export const getEnrolledCourses = async (req, res) => {
  const { usuario_id } = req.user;
  try {
    const [rows] = await pool.query(
      'SELECT curso_id FROM inscripciones WHERE usuario_id = ?',
      [usuario_id]
    );
    const ids = rows.map(r => r.curso_id);
    res.json(ids);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener inscripciones' });
  }
};
// 9. [NUEVO] Obtener mis cursos con porcentaje de avance real
export const getUserDashboard = async (req, res) => {
  const { usuario_id } = req.user;

  try {
    // Esta consulta es un poco avanzada (SQL JOINs), pero hace todo el trabajo:
    // 1. Busca tus inscripciones.
    // 2. Cuenta cuántas lecciones tiene el curso (total_lecciones).
    // 3. Cuenta cuántas has completado tú (completadas).
    const [cursos] = await pool.query(`
      SELECT 
        c.curso_id, 
        c.titulo, 
        c.descripcion, 
        u.nombre AS instructor,
        COUNT(DISTINCT l.leccion_id) as total_lecciones,
        COUNT(DISTINCT p.leccion_id) as lecciones_completadas
      FROM inscripciones i
      JOIN cursos c ON i.curso_id = c.curso_id
      JOIN usuarios u ON c.instructor_id = u.usuario_id
      LEFT JOIN lecciones l ON c.curso_id = l.curso_id
      LEFT JOIN progreso_usuario p ON l.leccion_id = p.leccion_id AND p.usuario_id = ?
      WHERE i.usuario_id = ?
      GROUP BY c.curso_id
    `, [usuario_id, usuario_id]);

    // Calculamos el porcentaje en Javascript para enviarlo listo
    const cursosConProgreso = cursos.map(curso => {
      const total = curso.total_lecciones || 0;
      const completadas = curso.lecciones_completadas || 0;
      const porcentaje = total === 0 ? 0 : Math.round((completadas / total) * 100);
      
      return {
        ...curso,
        progreso: porcentaje,
        isCompleted: porcentaje === 100
      };
    });

    // Calcular estadísticas globales para las tarjetas de arriba
    const totalCursos = cursosConProgreso.length;
    const cursosTerminados = cursosConProgreso.filter(c => c.progreso === 100).length;
    const sumaProgreso = cursosConProgreso.reduce((acc, curr) => acc + curr.progreso, 0);
    const promedioGeneral = totalCursos > 0 ? Math.round(sumaProgreso / totalCursos) : 0;

    res.json({
      stats: {
        totalCursos,
        cursosCompletados: cursosTerminados,
        progresoPromedio: promedioGeneral
      },
      cursos: cursosConProgreso
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener dashboard' });
  }
};