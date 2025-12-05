import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
});

// --- INTERCEPTOR (Para enviar el token automáticamente) ---
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- SERVICIO DE AUTENTICACIÓN ---
export const authService = {
  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  }
};

// --- SERVICIO DE CURSOS ---
export const courseService = {
  // 1. Obtener todos los cursos (Públicos)
  getAll: async () => {
    const response = await apiClient.get('/courses');
    return response.data;
  },

  // 2. Crear un curso (Admin)
  create: async (courseData) => {
    const response = await apiClient.post('/courses', courseData);
    return response.data;
  },

  // 3. Añadir lección (Admin - con archivo/video)
  addLesson: async (cursoId, lessonData) => {
    const response = await apiClient.post(`/courses/${cursoId}/lessons`, lessonData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // 4. Inscribirse a un curso (Estudiante)
  enroll: async (courseId) => {
    const response = await apiClient.post(`/courses/${courseId}/enroll`);
    return response.data;
  },

  // 5. Obtener contenido del curso para el reproductor (Estudiante)
  // Devuelve: info del curso, lecciones y estado de completado
  getCourseContent: async (cursoId) => {
    const response = await apiClient.get(`/courses/${cursoId}/play`);
    return response.data;
  },

  // 6. Marcar/Desmarcar lección como vista (Estudiante)
  toggleLesson: async (cursoId, leccionId) => {
    const response = await apiClient.post(`/courses/${cursoId}/lessons/${leccionId}/progress`);
    return response.data;
  },

  // 7. [NUEVO] Obtener lista de IDs de cursos inscritos (Para el Dashboard)
  // Esto permite saber qué botones mostrar como "Ir al Curso" al recargar la página
  getEnrolledIds: async () => {
    const response = await apiClient.get('/courses/enrolled');
    return response.data; // Devuelve un array de IDs, ej: [1, 5]
  },

  // 8. Obtener datos completos del dashboard (Cursos + Progreso)
  getMyDashboard: async () => {
    const response = await apiClient.get('/courses/my-dashboard');
    return response.data;
  }
  
};
