const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const authMiddleware = require('../middleware/authMiddleware');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Rutas de cursos
router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);

// Rutas de progreso
router.get('/progress/my-progress', courseController.getUserProgress);
router.post('/progress/start', courseController.startCourse);
router.put('/progress/update', courseController.updateProgress);

// Estadísticas
router.get('/stats/my-stats', courseController.getUserStats);

module.exports = router;