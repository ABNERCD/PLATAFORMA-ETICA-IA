import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar el token en cada petición
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// ========== AUTH ENDPOINTS ==========

export const authService = {
  // Registro
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Obtener perfil
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  }
};

// ========== COURSES ENDPOINTS ==========

export const courseService = {
  // Obtener todos los cursos
  getAllCourses: async () => {
    const response = await api.get('/courses');
    return response.data;
  },

  // Obtener un curso específico
  getCourseById: async (id) => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },

  // Obtener progreso del usuario
  getUserProgress: async () => {
    const response = await api.get('/courses/progress/my-progress');
    return response.data;
  },

  // Iniciar un curso
  startCourse: async (cursoId) => {
    const response = await api.post('/courses/progress/start', { cursoId });
    return response.data;
  },

  // Actualizar progreso
  updateProgress: async (cursoId, progreso) => {
    const response = await api.put('/courses/progress/update', { 
      cursoId, 
      progreso 
    });
    return response.data;
  },

  // Obtener estadísticas
  getUserStats: async () => {
    const response = await api.get('/courses/stats/my-stats');
    return response.data;
  }
};

export default api;