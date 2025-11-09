import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, LogOut, BookOpen, Award, TrendingUp, User } from 'lucide-react';
import { courseService } from '../services/api';

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
      
      // Cargar cursos y estadísticas en paralelo
      const [coursesResponse, statsResponse] = await Promise.all([
        courseService.getAllCourses(),
        courseService.getUserStats()
      ]);

      if (coursesResponse.success) {
        setCourses(coursesResponse.courses);
      }

      if (statsResponse.success) {
        setStats(statsResponse.stats);
      }

    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  const handleStartCourse = async (cursoId) => {
    try {
      const response = await courseService.startCourse(cursoId);
      if (response.success) {
        alert('¡Curso iniciado! Funcionalidad completa próximamente.');
        // Recargar estadísticas
        loadData();
      }
    } catch (error) {
      console.error('Error al iniciar curso:', error);
      alert('Error al iniciar el curso');
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

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">
                {stats.cursosCompletados}/{stats.totalCursos}
              </span>
            </div>
            <h3 className="text-gray-600 font-medium">Cursos Completados</h3>
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
          
          {courses.length === 0 ? (
            <p className="text-gray-600 text-center py-8">
              No hay cursos disponibles en este momento
            </p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {courses.map((course) => (
                <div 
                  key={course.id} 
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {course.titulo}
                  </h3>
                  <p className="text-gray-600 mb-4">{course.descripcion}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-4 text-sm text-gray-500">
                      <span>⏱️ {course.duracion}</span>
                      <span>📊 {course.nivel}</span>
                    </div>
                    <button 
                      onClick={() => handleStartCourse(course.id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
                    >
                      Comenzar
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