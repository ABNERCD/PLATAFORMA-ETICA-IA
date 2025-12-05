import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { 
  BookOpen, Users, Shield, Award, ChevronRight, Menu, X, 
  Brain, AlertTriangle, Target, Sparkles, ArrowRight, 
  CheckCircle, Zap, Globe, Heart
} from 'lucide-react';
// Nota: AuthPage y Dashboard no se usan aquí, por lo que se pueden omitir.
// import AuthPage from './pages/AuthPage';
// import Dashboard from './pages/Dashboard';

// Componente de contador animado
const AnimatedCounter = ({ value, suffix = "", duration = 2 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = parseInt(value);
      const increment = end / (duration * 60);
      const timer = setInterval(() => {
        start += increment;
        if (start > end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 1000 / 60);
      return () => clearInterval(timer);
    }
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className="font-bold text-4xl md:text-5xl">
      {count}{suffix}
    </span>
  );
};

// Componente de la Página de Inicio
function HomePage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 100], [0.8, 0.95]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const features = [
    {
      icon: <BookOpen className="w-10 h-10" />,
      title: "Cursos Especializados",
      description: "Módulos enfocados en ética de IA, sesgos algorítmicos y responsabilidad social",
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      icon: <Brain className="w-10 h-10" />,
      title: "Casos Reales",
      description: "Análisis de situaciones documentadas de discriminación algorítmica",
      gradient: "from-purple-500 to-pink-600"
    },
    {
      icon: <Shield className="w-10 h-10" />,
      title: "Certificación Gratuita",
      description: "Obtén reconocimiento por tu formación ética en desarrollo de IA",
      gradient: "from-green-500 to-emerald-600"
    },
    {
      icon: <Users className="w-10 h-10" />,
      title: "Comunidad Activa",
      description: "Conecta con estudiantes de Sistemas en Ecatepec y México",
      gradient: "from-orange-500 to-red-600"
    }
  ];

  const stats = [
    { number: "2026", label: "Año de lanzamiento", icon: <Zap /> },
    { number: "100", label: "Gratuito", suffix: "%", icon: <Heart /> },
    { number: "4", label: "Módulos disponibles", suffix: "+", icon: <BookOpen /> },
    { number: "∞", label: "Impacto social", icon: <Globe /> }
  ];

  const problematics = [
    {
      icon: <AlertTriangle className="w-8 h-8" />,
      title: "Discriminación en Contratación",
      description: "Algoritmos que perpetúan sesgos de género y raza en procesos de selección"
    },
    {
      icon: <AlertTriangle className="w-8 h-8" />,
      title: "Reconocimiento Facial Sesgado",
      description: "Sistemas con tasas de error hasta 34% mayores en personas de piel oscura"
    },
    {
      icon: <AlertTriangle className="w-8 h-8" />,
      title: "Falta de Formación Ética",
      description: "Profesionales con habilidades técnicas pero sin base en responsabilidad social"
    }
  ];

  return (
    <>
      {/* Fondo animado */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50" />
        <motion.div
          animate={{
            background: [
              'radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.25) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 20%, rgba(99, 102, 241, 0.25) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.25) 0%, transparent 50%)',
            ]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0"
        />
      </div>

      {/* Header con glassmorphism */}
      <motion.header
        style={{ background: headerOpacity }}
        className={`fixed top-0 left-0 right-0 backdrop-blur-xl z-50 transition-all duration-300 ${
          scrolled ? 'shadow-lg border-b border-white/20' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => scrollToSection('inicio')}
            >
              <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Ética en IA
              </span>
            </motion.div>

            <nav className="hidden md:flex items-center space-x-8">
              {['inicio', 'problema', 'cursos', 'contacto'].map((section) => (
                <motion.button
                  key={section}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => scrollToSection(section)}
                  className="text-gray-700 hover:text-blue-600 font-medium transition capitalize"
                >
                  {section === 'inicio' ? 'Inicio' : 
                   section === 'problema' ? 'Problemática' :
                   section === 'cursos' ? 'Cursos' : 'Contacto'}
                </motion.button>
              ))}
            </nav>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-gray-700"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100"
          >
            <div className="px-4 py-4 space-y-3">
              {['inicio', 'problema', 'cursos', 'contacto'].map((section) => (
                <button
                  key={section}
                  onClick={() => { scrollToSection(section); setMenuOpen(false); }}
                  className="block w-full text-left text-gray-700 hover:text-blue-600 font-medium py-2 transition"
                >
                  {section === 'inicio' ? 'Inicio' : 
                   section === 'problema' ? 'Problemática' :
                   section === 'cursos' ? 'Cursos' : 'Contacto'}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </motion.header>

      {/* Hero Section */}
      <section id="inicio" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="inline-block mb-6"
            >
              <span className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 text-sm font-bold px-6 py-3 rounded-full shadow-lg">
                Ecatepec, México 2026
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight"
            >
              Desarrollo Ético de<br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Inteligencia Artificial
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xl md:text-2xl text-gray-600 mb-10 max-w-4xl mx-auto"
            >
              Plataforma <span className="font-bold text-blue-600">gratuita</span> de capacitación para estudiantes de Sistemas en Ecatepec. 
              Aprende a desarrollar IA con <span className="font-bold">responsabilidad social</span> y <span className="font-bold">conciencia ética</span>.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/auth')}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl flex items-center justify-center space-x-2 hover:shadow-2xl transition-all"
              >
                <Sparkles className="w-5 h-5" />
                <span>Comenzar Ahora</span>
                <ChevronRight className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection('cursos')}
                className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition flex items-center justify-center space-x-2"
              >
                <span>Explorar Cursos</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Estadísticas animadas */}
      <section className="py-16 bg-white/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <div className="text-blue-600">
                  <AnimatedCounter value={stat.number} suffix={stat.suffix} />
                </div>
                <p className="text-gray-600 mt-2 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Problemática */}
      <section id="problema" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-red-50 via-orange-50 to-amber-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              La Problemática que Enfrentamos
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              La integración acelerada de IA ha evidenciado <span className="font-bold text-red-600">graves consecuencias sociales</span> 
              por la falta de formación ética en desarrolladores
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {problematics.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white/90 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white/50 hover:shadow-2xl transition-all"
              >
                <div className="text-red-500 mb-6">{item.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white/95 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border-l-8 border-red-500"
          >
            <div className="flex items-start space-x-6">
              <div className="p-4 bg-red-100 rounded-2xl">
                <Target className="w-10 h-10 text-red-600" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Brecha Crítica Identificada</h3>
                <p className="text-lg text-gray-700 leading-relaxed mb-3">
                  Los profesionales cuentan con competencias técnicas avanzadas pero carecen de 
                  conocimientos sólidos en <span className="font-bold">ética digital</span> y <span className="font-bold">responsabilidad social</span>.
                </p>
                <p className="text-lg text-gray-700">
                  Esta plataforma busca <span className="font-bold text-blue-600">cerrar esa brecha</span> mediante capacitación accesible y gratuita.
                </p>
                <p className="text-sm text-gray-500 mt-4 italic">Fuente: CONAHCyT, 2023</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cursos */}
      <section id="cursos" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              ¿Qué Ofrecemos?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Una plataforma completa para tu formación ética en desarrollo de IA
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -12, scale: 1.03 }}
                className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/30 hover:shadow-2xl transition-all cursor-default"
              >
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} text-white mb-6 shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex p-6 bg-white/20 backdrop-blur-xl rounded-full mb-8"
          >
            <Award className="w-20 h-20 text-white" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Comienza Tu Formación Hoy
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-blue-100 mb-10"
          >
            Acceso 100% gratuito a todos los cursos y materiales. Sin costos ocultos.
          </motion.p>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(255,255,255,0.3)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/auth')}
            className="bg-white text-blue-600 px-10 py-5 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl transition-all inline-flex items-center space-x-3"
          >
            <Sparkles className="w-6 h-6" />
            <span>Registrarse Gratis</span>
            <ChevronRight className="w-6 h-6" />
          </motion.button>
        </div>
      </section>

      {/* Footer */}
      <footer id="contacto" className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <span className="font-bold text-2xl">Ética en IA</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Formando desarrolladores responsables para el futuro de la inteligencia artificial.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h4 className="font-bold text-xl mb-6">Enlaces Rápidos</h4>
              <div className="space-y-3">
                {['inicio', 'problema', 'cursos', 'contacto'].map((section) => (
                  <button
                    key={section}
                    onClick={() => scrollToSection(section)}
                    className="block text-gray-400 hover:text-white transition font-medium"
                  >
                    {section === 'inicio' ? 'Inicio' : 
                     section === 'problema' ? 'Problemática' :
                     section === 'cursos' ? 'Cursos' : 'Contacto'}
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h4 className="font-bold text-xl mb-6">Ubicación</h4>
              <p className="text-gray-400 leading-relaxed">
                Ecatepec de Morelos<br />
                Estado de México<br />
                México 2026
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="border-t border-gray-800 pt-8 text-center"
          >
            <p className="text-gray-400 text-sm">
              © 2025 <span className="font-bold text-blue-400">Plataforma Ética en IA</span>. 
              Proyecto académico para estudiantes de Sistemas.
            </p>
          </motion.div>
        </div>
      </footer>
    </>
  );
}

// ¡Línea clave! Esto hace que el archivo pueda ser importado por App.jsx
export default HomePage;