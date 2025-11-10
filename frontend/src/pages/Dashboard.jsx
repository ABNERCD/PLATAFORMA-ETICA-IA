import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, LogOut, BookOpen, Award, TrendingUp, User, 
  CheckCircle, AlertCircle 
} from 'lucide-react';
import { authService, courseService } from '../services/api';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({
    totalCursos: 0,
    cursosCompletados: 0,
    progresoPromedio: 0
  });
  const [loading, setLoading] = useState(true);
  
  // --- AÑADIDO ---
  // Para mostrar mensajes de éxito/error al inscribirse
  const [message, setMessage] = useState(''); 

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const token = localStorage.getItem('token');
    
    if (!currentUser || !token) {
      navigate('/auth');
      return;
    }
    
    setUser(currentUser);
    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // 1. Llamamos a la función con el nombre correcto: getAll()
      const coursesData = await courseService.getAll();

      // 2. 'coursesData' ES el array, así que lo asignamos directamente
      setCourses(coursesData);

      // --- NOTA ---
      // La parte de 'getUserStats' aún no está implementada en el backend.
      // La dejaremos pendiente por ahora.

    } catch (error) {
      console.error('Error al cargar datos:', error);
      setMessage('Error al cargar los cursos.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  // --- ¡FUNCIÓN ACTUALIZADA! ---
  // Esta es la función que creamos para inscribirse
  const handleEnroll = async (courseId) => {
    try {
      // Llama al servicio de API
      const response = await courseService.enroll(courseId);
      setMessage(response.message); // "¡Inscripción exitosa!"
      
      // Limpiamos el mensaje después de 3 segundos
      setTimeout(() => setMessage(''), 3000);

    } catch (error) {
      // Muestra el error de "Ya estás inscrito"
      setMessage(error.response?.data?.message || 'Error al inscribirse.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <span className="font-bold text-xl text-gray-800">Ética en IA</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg">
                <User className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-700">{user.nombre}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition"
              >
                <LogOut className="w-5 h-5" />
                <span>Salir</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenido Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white mb-8">
          <h1 className="text-3xl font-bold mb-2">
            ¡Bienvenido, {user.nombre}! 🎉
          </h1>
          <p className="text-blue-100">
            Comienza tu viaje de aprendizaje en ética de IA
          </p>
        </div>

        {/* Stats Cards (Aún no funcionales, pero visualmente listas) */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">
                {stats.cursosCompletados}/{courses.length}
              </span>
            </div>
            <h3 className="text-gray-600 font-medium">Cursos Disponibles</h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <span className="text-2xl font-bold text-gray-900">
                {stats.progresoPromedio}%
              </span>
            </div>
            <h3 className="text-gray-600 font-medium">Progreso General</h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <Award className="w-8 h-8 text-yellow-600" />
              <span className="text-2xl font-bold text-gray-900">
                {stats.cursosCompletados}
              </span>
            </div>
            <h3 className="text-gray-600 font-medium">Certificados</h3>
          </div>
        </div>

        {/* Cursos Disponibles */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Cursos Disponibles
          </h2>

          {/* --- MENSAJE DE ÉXITO/ERROR AÑADIDO --- */}
          {message && (
            <div className={`p-4 mb-4 rounded ${message.includes('Error') || message.includes('inscrito') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {message.includes('Error') || message.includes('inscrito') ? <AlertCircle className="inline w-5 h-5 mr-2"/> : <CheckCircle className="inline w-5 h-5 mr-2"/>}
              {message}
            </div>
          )}
          
          {courses.length === 0 ? (
            <p className="text-gray-600 text-center py-8">
              No hay cursos disponibles en este momento
            </p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {courses.map((course) => (
                <div 
                  // --- CORREGIDO ---
                  // Cambiado de 'course.id' a 'course.curso_id' para que coincida con la BD
                  key={course.curso_id} 
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {course.titulo}
                    </h3>
                    {/* --- AÑADIDO ---
                    // 'instructor' viene de la API que creamos */}
                    <p className="text-sm text-gray-500 mb-2">Impartido por: {course.instructor}</p>
                    <p className="text-gray-600 mb-4">{course.descripcion}</p>
                  </div>
                  
                  {/* --- CORREGIDO ---
                  // Quité 'duracion' y 'nivel' porque no están en la BD
                  // El botón ahora llama a handleEnroll con el ID correcto */}
                  <div className="flex items-center justify-end">
                    <button 
                      onClick={() => handleEnroll(course.curso_id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
                    >
                      Inscribirme Ahora
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;