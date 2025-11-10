import { Router } from 'express';
import { protect, isInstructor } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
import { createCourse, addLesson, getAllCourses } from '../controllers/courseController.js';

const router = Router();

// --- Rutas Públicas ---
// GET /api/courses (Cualquiera puede ver los cursos)
router.get('/', getAllCourses);

// --- Rutas Protegidas (Instructores) ---
// POST /api/courses (Crear un curso)
router.post('/', protect, isInstructor, createCourse);

// POST /api/courses/:curso_id/lessons (Añadir lección a un curso)
// 'upload.single('material')' debe coincidir con el nombre del input en el frontend
router.post(
  '/:curso_id/lessons', 
  protect, 
  isInstructor, 
  upload.single('material'), // Middleware de multer para un solo archivo
  addLesson
);

export default router;