import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
});

// --- ¡MEJORA IMPORTANTE: INTERCEPTOR! ---
// Esto agregará el token 'Bearer' a CADA petición automáticamente
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

// --- Servicio de Autenticación (que ya tenías) ---
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

// --- SERVICIO DE CURSOS (ACTUALIZADO) ---
export const courseService = {
  // Obtener todos los cursos
  getAll: async () => {
    const response = await apiClient.get('/courses');
    return response.data;
  },

  // Crear un curso (envía JSON)
  create: async (courseData) => {
    // courseData debe ser { titulo: '...', descripcion: '...' }
    const response = await apiClient.post('/courses', courseData);
    return response.data;
  },

  // Añadir una lección (envía FormData porque puede incluir un archivo)
  addLesson: async (cursoId, lessonData) => {
    // lessonData debe ser un objeto FormData
    const response = await apiClient.post(`/courses/${cursoId}/lessons`, lessonData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Importante para que multer funcione
      },
    });
    return response.data;
  },

  // --- ¡NUEVA FUNCIÓN AÑADIDA! ---
  // Inscribirse a un curso
  enroll: async (courseId) => {
    // Llama a la nueva ruta que creamos en el backend
    const response = await apiClient.post(`/courses/${courseId}/enroll`);
    return response.data;
  }
};