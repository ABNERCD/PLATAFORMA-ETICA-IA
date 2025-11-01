import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { BookOpen, Users, Shield, Award, ChevronRight, Menu, X, Brain, AlertTriangle, Target } from 'lucide-react';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';

// Componente de la Página de Inicio
function HomePage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const features = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Cursos Especializados",
      description: "Módulos enfocados en ética de IA, sesgos algorítmicos y responsabilidad social"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Casos Reales",
      description: "Análisis de situaciones documentadas de discriminación algorítmica"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Certificación Gratuita",
      description: "Obtén reconocimiento por tu formación ética en desarrollo de IA"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Comunidad Activa",
      description: "Conecta con estudiantes de Sistemas en Ecatepec y México"
    }
  ];

  const stats = [
    { number: "2026", label: "Año de lanzamiento" },
    { number: "100%", label: "Gratuito" },
    { number: "4+", label: "Módulos disponibles" },
    { number: "∞", label: "Impacto social" }
  ];

  const problematics = [
    {
      icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
      title: "Discriminación en Contratación",
      description: "Algoritmos que perpetúan sesgos de género y raza en procesos de selección"
    },
    {
      icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
      title: "Reconocimiento Facial Sesgado",
      description: "Sistemas con tasas de error hasta 34% mayores en personas de piel oscura"
    },
    {
      icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
      title: "Falta de Formación Ética",
      description: "Profesionales con habilidades técnicas pero sin base en responsabilidad social"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <nav className="bg-white shadow-md fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <span className="font-bold text-xl text-gray-800">Ética en IA</span>
            </div>
            
            <div className="hidden md:flex space-x-8">
              <a href="#inicio" className="text-gray-700 hover:text-blue-600 transition">Inicio</a>
              <a href="#problema" className="text-gray-700 hover:text-blue-600 transition">Problemática</a>
              <a href="#cursos" className="text-gray-700 hover:text-blue-600 transition">Cursos</a>
              <a href="#contacto" className="text-gray-700 hover:text-blue-600 transition">Contacto</a>
            </div>

            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-gray-700"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-3 space-y-3">
              <a href="#inicio" className="block text-gray-700 hover:text-blue-600">Inicio</a>
              <a href="#problema" className="block text-gray-700 hover:text-blue-600">Problemática</a>
              <a href="#cursos" className="block text-gray-700 hover:text-blue-600">Cursos</a>
              <a href="#contacto" className="block text-gray-700 hover:text-blue-600">Contacto</a>
            </div>
          </div>
        )}
      </nav>

      <section id="inicio" className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-block mb-4">
              <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-2 rounded-full">
                Ecatepec, México 2026
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Desarrollo Ético de <span className="text-blue-600">Inteligencia Artificial</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Plataforma gratuita de capacitación para estudiantes de Sistemas en Ecatepec. 
              Aprende a desarrollar IA con responsabilidad social y conciencia ética.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/auth')}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center space-x-2"
              >
                <span>Comenzar Ahora</span>
                <ChevronRight className="w-5 h-5" />
              </button>
              <button className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
                Ver Cursos
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="problema" className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              La Problemática que Enfrentamos
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              La integración acelerada de IA ha evidenciado graves consecuencias sociales 
              por la falta de formación ética en desarrolladores
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {problematics.map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
                <div className="mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-white p-8 rounded-xl shadow-lg border-l-4 border-red-500">
            <div className="flex items-start space-x-4">
              <Target className="w-8 h-8 text-red-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Brecha Crítica Identificada</h3>
                <p className="text-gray-700 leading-relaxed">
                  Los profesionales cuentan con competencias técnicas avanzadas pero carecen de 
                  conocimientos sólidos en ética digital y responsabilidad social. Esta plataforma 
                  busca cerrar esa brecha formativa mediante capacitación accesible y gratuita.
                </p>
                <p className="text-sm text-gray-500 mt-3">Fuente: CONAHCyT, 2023</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="cursos" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ¿Qué Ofrecemos?
            </h2>
            <p className="text-lg text-gray-600">
              Una plataforma completa para tu formación ética en desarrollo de IA
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto text-center">
          <Award className="w-16 h-16 text-white mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Comienza Tu Formación Hoy
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Acceso 100% gratuito a todos los cursos y materiales. Sin costos ocultos.
          </p>
          <button 
            onClick={() => navigate('/auth')}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition inline-flex items-center space-x-2"
          >
            <span>Registrarse Gratis</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      <footer id="contacto" className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="w-8 h-8 text-blue-400" />
                <span className="font-bold text-xl">Ética en IA</span>
              </div>
              <p className="text-gray-400">
                Formando desarrolladores responsables para el futuro de la inteligencia artificial.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4">Enlaces Rápidos</h4>
              <div className="space-y-2">
                <a href="#inicio" className="block text-gray-400 hover:text-white transition">Inicio</a>
                <a href="#problema" className="block text-gray-400 hover:text-white transition">Problemática</a>
                <a href="#cursos" className="block text-gray-400 hover:text-white transition">Cursos</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4">Ubicación</h4>
              <p className="text-gray-400">
                Ecatepec de Morelos<br />
                Estado de México<br />
                México 2026
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Plataforma Ética en IA. Proyecto académico para estudiantes de Sistemas.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Componente Principal App con Router
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;