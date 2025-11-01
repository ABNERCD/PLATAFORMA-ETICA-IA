const db = require('../config/database');

// Obtener todos los cursos
exports.getAllCourses = async (req, res) => {
  try {
    const [courses] = await db.query(
      'SELECT * FROM cursos ORDER BY id ASC'
    );

    res.json({
      success: true,
      courses
    });

  } catch (error) {
    console.error('Error al obtener cursos:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error en el servidor' 
    });
  }
};

// Obtener un curso específico
exports.getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    const [courses] = await db.query(
      'SELECT * FROM cursos WHERE id = ?',
      [id]
    );

    if (courses.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Curso no encontrado' 
      });
    }

    res.json({
      success: true,
      course: courses[0]
    });

  } catch (error) {
    console.error('Error al obtener curso:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error en el servidor' 
    });
  }
};

// Obtener progreso del usuario en cursos
exports.getUserProgress = async (req, res) => {
  try {
    const userId = req.userId;

    const [progress] = await db.query(`
      SELECT 
        p.*,
        c.titulo,
        c.descripcion,
        c.duracion,
        c.nivel
      FROM progreso_usuario p
      INNER JOIN cursos c ON p.curso_id = c.id
      WHERE p.usuario_id = ?
      ORDER BY p.fecha_inicio DESC
    `, [userId]);

    res.json({
      success: true,
      progress
    });

  } catch (error) {
    console.error('Error al obtener progreso:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error en el servidor' 
    });
  }
};

// Iniciar un curso (registrar progreso)
exports.startCourse = async (req, res) => {
  try {
    const userId = req.userId;
    const { cursoId } = req.body;

    // Verificar si ya existe el registro
    const [existing] = await db.query(
      'SELECT id FROM progreso_usuario WHERE usuario_id = ? AND curso_id = ?',
      [userId, cursoId]
    );

    if (existing.length > 0) {
      return res.json({
        success: true,
        message: 'Ya has iniciado este curso',
        progressId: existing[0].id
      });
    }

    // Crear registro de progreso
    const [result] = await db.query(
      'INSERT INTO progreso_usuario (usuario_id, curso_id) VALUES (?, ?)',
      [userId, cursoId]
    );

    res.json({
      success: true,
      message: 'Curso iniciado',
      progressId: result.insertId
    });

  } catch (error) {
    console.error('Error al iniciar curso:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error en el servidor' 
    });
  }
};

// Actualizar progreso de un curso
exports.updateProgress = async (req, res) => {
  try {
    const userId = req.userId;
    const { cursoId, progreso } = req.body;

    // Actualizar progreso
    await db.query(
      `UPDATE progreso_usuario 
       SET progreso_porcentaje = ?,
           fecha_completado = IF(? >= 100, NOW(), NULL)
       WHERE usuario_id = ? AND curso_id = ?`,
      [progreso, progreso, userId, cursoId]
    );

    res.json({
      success: true,
      message: 'Progreso actualizado'
    });

  } catch (error) {
    console.error('Error al actualizar progreso:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error en el servidor' 
    });
  }
};

// Obtener estadísticas del usuario
exports.getUserStats = async (req, res) => {
  try {
    const userId = req.userId;

    // Total de cursos
    const [totalCourses] = await db.query('SELECT COUNT(*) as total FROM cursos');
    
    // Cursos completados
    const [completedCourses] = await db.query(
      'SELECT COUNT(*) as total FROM progreso_usuario WHERE usuario_id = ? AND progreso_porcentaje = 100',
      [userId]
    );

    // Progreso promedio
    const [avgProgress] = await db.query(
      'SELECT AVG(progreso_porcentaje) as promedio FROM progreso_usuario WHERE usuario_id = ?',
      [userId]
    );

    res.json({
      success: true,
      stats: {
        totalCursos: totalCourses[0].total,
        cursosCompletados: completedCourses[0].total,
        progresoPromedio: Math.round(avgProgress[0].promedio || 0)
      }
    });

  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error en el servidor' 
    });
  }
};