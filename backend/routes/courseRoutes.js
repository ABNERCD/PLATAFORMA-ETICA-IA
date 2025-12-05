import { Router } from 'express';
import { protect, isInstructor } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
import { 
  createCourse, 
  addLesson, 
  getAllCourses, 
  enrollInCourse,
  getCourseDetails,
  toggleLessonProgress,
  getEnrolledCourses,
  getUserDashboard
} from '../controllers/courseController.js';

const router = Router();

// ==========================================
// RUTAS PÚBLICAS
// ==========================================
router.get('/', getAllCourses);


// ==========================================
// RUTAS DE INSTRUCTOR / ADMIN
// ==========================================
router.post('/', protect, isInstructor, createCourse);

router.post(
  '/:curso_id/lessons', 
  protect, 
  isInstructor, 
  upload.single('material'), 
  addLesson
);


// ==========================================
// RUTAS DE ESTUDIANTE
// ==========================================

// --- Inscripciones ---

// 2. AGREGA ESTA RUTA ANTES DE LAS OTRAS DE ID
// (Es importante ponerla antes de /:curso_id para evitar confusiones en Express)
router.get('/enrolled', protect, getEnrolledCourses); 

router.post('/:curso_id/enroll', protect, enrollInCourse);

// --- Reproductor y Contenido ---
router.get('/:curso_id/play', protect, getCourseDetails);

router.post('/:curso_id/lessons/:leccion_id/progress', protect, toggleLessonProgress);

router.get('/my-dashboard', protect, getUserDashboard); 


export default router;