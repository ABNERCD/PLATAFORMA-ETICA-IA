import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, BookOpen, Award, TrendingUp, LogOut, 
  Search, Bell, PlayCircle, PlusCircle, CheckCircle, User 
} from 'lucide-react';
import { authService, courseService } from '../services/api';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  // Datos
  const [myCourses, setMyCourses] = useState([]); // Cursos donde YA estoy inscrito
  const [allCourses, setAllCourses] = useState([]); // Catálogo completo para explorar
  
  const [stats, setStats] = useState({
    totalCursos: 0,
    cursosCompletados: 0,
    progresoPromedio: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('mis-cursos'); // 'mis-cursos' | 'explorar'

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
      
      // 1. Obtener mis cursos con su PROGRESO REAL (Nueva función del backend)
      const dashboardData = await courseService.getMyDashboard();
      
      // 2. Obtener catálogo completo para la pestaña "Explorar"
      const catalogoData = await courseService.getAll();

      setStats(dashboardData.stats);
      setMyCourses(dashboardData.cursos);
      
      // Filtramos el catálogo para no mostrar los que ya tengo inscritos en la pestaña de explorar
      const myIds = new Set(dashboardData.cursos.map(c => c.curso_id));
      const disponibles = catalogoData.filter(c => !myIds.has(c.curso_id));
      setAllCourses(disponibles);

    } catch (error) {
      console.error('Error cargando dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      await courseService.enroll(courseId);
      // Recargar datos para mover el curso de "Explorar" a "Mis Cursos"
      loadData(); 
      setActiveTab('mis-cursos');
    } catch (error) {
      alert("Error al inscribirse");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-slate-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      
      {/* === SIDEBAR === */}
      <aside className="hidden md:flex w-64 flex-col bg-white border-r border-gray-200">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <BookOpen className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-xl text-gray-800">Ética IA</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('mis-cursos')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'mis-cursos' 
                ? 'bg-indigo-50 text-indigo-700 font-semibold' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Mi Aprendizaje</span>
          </button>

          <button 
            onClick={() => setActiveTab('explorar')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'explorar' 
                ? 'bg-indigo-50 text-indigo-700 font-semibold' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <Search className="w-5 h-5" />
            <span>Explorar Cursos</span>
          </button>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button onClick={handleLogout} className="flex items-center gap-3 text-gray-500 hover:text-red-600 transition px-4 py-2 w-full">
            <LogOut className="w-5 h-5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* === CONTENIDO PRINCIPAL === */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto">
        
        {/* HEADER */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Hola, {user.nombre.split(' ')[0]} 👋</h1>
            <p className="text-sm text-gray-500">Continuemos con tu formación ética.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold border-2 border-indigo-200">
              {user.nombre.charAt(0)}
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto w-full space-y-8 pb-20">

          {/* STATS CARDS (Solo visibles en "Mi Aprendizaje") */}
          {activeTab === 'mis-cursos' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200 transform transition hover:-translate-y-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full">En curso</span>
                </div>
                <h3 className="text-3xl font-bold mb-1">{myCourses.length}</h3>
                <p className="text-indigo-100 text-sm">Cursos Activos</p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-1">{stats.progresoPromedio}%</h3>
                <p className="text-gray-500 text-sm">Promedio General</p>
                <div className="w-full bg-gray-100 h-1.5 mt-3 rounded-full">
                  <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${stats.progresoPromedio}%` }}></div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                    <Award className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-1">{stats.cursosCompletados}</h3>
                <p className="text-gray-500 text-sm">Certificados Ganados</p>
              </div>
            </div>
          )}

          {/* LISTA DE CURSOS */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                {activeTab === 'mis-cursos' ? 'Mis Cursos' : 'Explorar Catálogo'}
              </h2>
            </div>

            {/* VISTA: MIS CURSOS (CON BARRA DE PROGRESO) */}
            {activeTab === 'mis-cursos' && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myCourses.length === 0 ? (
                  <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-dashed border-gray-300">
                    <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Aún no estás inscrito en ningún curso.</p>
                    <button onClick={() => setActiveTab('explorar')} className="text-indigo-600 font-bold mt-2 hover:underline">
                      Ir al catálogo
                    </button>
                  </div>
                ) : (
                  myCourses.map(course => (
                    <div key={course.curso_id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between h-full">
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                            course.progreso === 100 ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-700'
                          }`}>
                            {course.progreso === 100 ? 'Completado' : 'En Progreso'}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{course.titulo}</h3>
                        <p className="text-gray-500 text-sm line-clamp-2 mb-4">{course.descripcion}</p>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
                          <span>Avance</span>
                          <span>{course.progreso}%</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mb-6">
                          <div 
                            className={`h-2 rounded-full transition-all duration-1000 ${
                              course.progreso === 100 ? 'bg-green-500' : 'bg-indigo-600'
                            }`} 
                            style={{ width: `${course.progreso}%` }}
                          />
                        </div>

                        <button 
                          onClick={() => navigate(`/curso/${course.curso_id}`)}
                          className="w-full py-3 rounded-xl bg-gray-900 text-white font-semibold flex items-center justify-center gap-2 group-hover:bg-indigo-600 transition-colors"
                        >
                          {course.progreso > 0 ? 'Continuar' : 'Empezar'} <PlayCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* VISTA: EXPLORAR (BOTÓN INSCRIBIRME) */}
            {activeTab === 'explorar' && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allCourses.length === 0 ? (
                  <p className="text-gray-500 col-span-full text-center">¡Ya te has inscrito a todos los cursos disponibles!</p>
                ) : (
                  allCourses.map(course => (
                    <div key={course.curso_id} className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-indigo-200 hover:shadow-lg transition-all flex flex-col justify-between">
                      <div>
                        <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4 text-indigo-600">
                          <Award className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{course.titulo}</h3>
                        <p className="text-sm text-gray-500 mb-2">Instructor: {course.instructor}</p>
                        <p className="text-gray-600 text-sm mb-6">{course.descripcion}</p>
                      </div>
                      <button 
                        onClick={() => handleEnroll(course.curso_id)}
                        className="w-full py-3 rounded-xl border-2 border-indigo-600 text-indigo-600 font-bold hover:bg-indigo-50 transition flex items-center justify-center gap-2"
                      >
                        <PlusCircle className="w-5 h-5" /> Inscribirme Gratis
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;