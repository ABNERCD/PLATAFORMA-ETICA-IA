import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Shield, Mail, Lock, User, Eye, EyeOff, 
  AlertCircle, CheckCircle, Home, Sparkles 
} from 'lucide-react';
import { authService } from '../services/api';

function AuthPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!isLogin && !formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.email.trim()) newErrors.email = 'El correo es requerido';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Correo inválido';
    if (!formData.password) newErrors.password = 'La contraseña es requerida';
    else if (formData.password.length < 6) newErrors.password = 'Mínimo 6 caracteres';
    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      if (isLogin) {
        const response = await authService.login({
          email: formData.email,
          password: formData.password
        });
        if (response.success) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          setSuccess('¡Bienvenido de nuevo!');
          setTimeout(() => navigate('/dashboard'), 1200);
        }
      } else {
        const response = await authService.register({
          nombre: formData.nombre,
          email: formData.email,
          password: formData.password
        });
        if (response.success) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          setSuccess('¡Cuenta creada con éxito!');
          setTimeout(() => navigate('/'), 1200);
        }
      }
    } catch (error) {
      setErrors({ 
        general: error.response?.data?.message || 'Error de conexión. Intenta de nuevo.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setSuccess('');
    setFormData({ nombre: '', email: '', password: '', confirmPassword: '' });
  };

  return (
    <>
      {/* Fondo animado con gradiente sutil */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" />
        <motion.div
          animate={{ 
            background: [
              'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 20%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)',
            ]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 opacity-40"
        />
      </div>

      {/* Header fijo */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 bg-white/70 backdrop-blur-xl shadow-lg z-50 border-b border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="flex items-center space-x-3 group"
            >
              <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl group-hover:shadow-lg transition-shadow">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Ética en IA
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium shadow-md hover:shadow-xl transition-all"
            >
              <Home className="w-4 h-4" />
              <span>Inicio</span>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Contenido principal */}
      <main className="min-h-screen flex items-center justify-center p-4 pt-24 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Tarjeta con glassmorphism */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden border border-white/20"
          >
            {/* Header de la tarjeta */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="flex justify-center mb-6"
              >
                <div className="p-4 bg-white/20 backdrop-blur rounded-2xl shadow-lg">
                  <Shield className="w-14 h-14" />
                </div>
              </motion.div>

              <motion.h2 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold text-center mb-2"
              >
                {isLogin ? '¡Hola de nuevo!' : 'Crea tu cuenta'}
              </motion.h2>
              <p className="text-center text-white/80 text-sm">
                {isLogin ? 'Accede a tu panel de ética en IA' : 'Únete a la comunidad'}
              </p>

              {/* Tabs animados */}
              <motion.div 
                layout
                className="flex bg-white/10 backdrop-blur rounded-xl p-1 mt-6"
              >
                {['Iniciar Sesión', 'Registrarse'].map((tab, i) => (
                  <motion.button
                    key={tab}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => !loading && (i === 0 ? setIsLogin(true) : setIsLogin(false))}
                    disabled={loading}
                    className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all relative overflow-hidden ${
                      (i === 0 && isLogin) || (i === 1 && !isLogin)
                        ? 'text-blue-600' 
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    {((i === 0 && isLogin) || (i === 1 && !isLogin)) && (
                      <motion.div
                        layoutId="auth-tab"
                        className="absolute inset-0 bg-white rounded-lg"
                        transition={{ type: "spring", stiffness: 300 }}
                      />
                    )}
                    <span className="relative z-10">{tab}</span>
                  </motion.button>
                ))}
              </motion.div>
            </div>

            {/* Formulario */}
            <div className="p-8 space-y-6">
              {/* Mensajes */}
              {errors.general && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3 text-red-700"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{errors.general}</span>
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center space-x-3 text-green-700"
                >
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{success}</span>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Nombre */}
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nombre Completo
                    </label>
                    <div className="relative group">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-600 transition" />
                      <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        disabled={loading}
                        className={`w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all group-hover:bg-gray-50 ${
                          errors.nombre ? 'border-red-400' : 'border-gray-200'
                        }`}
                        placeholder="Juan Pérez"
                      />
                    </div>
                    {errors.nombre && <p className="mt-1 text-xs text-red-600">{errors.nombre}</p>}
                  </motion.div>
                )}

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Correo Electrónico
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-600 transition" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={loading}
                      className={`w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all group-hover:bg-gray-50 ${
                        errors.email ? 'border-red-400' : 'border-gray-200'
                      }`}
                      placeholder="tucorreo@ejemplo.com"
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                </div>

                {/* Contraseña */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Contraseña
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-600 transition" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={loading}
                      className={`w-full pl-11 pr-12 py-3.5 bg-gray-50/50 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all group-hover:bg-gray-50 ${
                        errors.password ? 'border-red-400' : 'border-gray-200'
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
                </div>

                {/* Confirmar contraseña */}
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Confirmar Contraseña
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-600 transition" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        disabled={loading}
                        className={`w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all group-hover:bg-gray-50 ${
                          errors.confirmPassword ? 'border-red-400' : 'border-gray-200'
                        }`}
                        placeholder="••••••••"
                      />
                    </div>
                    {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}
                  </motion.div>
                )}

                {/* Botón principal */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform transition-all flex items-center justify-center space-x-2 ${
                    loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? (
                    <motion.div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Procesando...</span>
                    </motion.div>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</span>
                    </>
                  )}
                </motion.button>
              </form>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  {isLogin ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
                  <button
                    onClick={switchMode}
                    disabled={loading}
                    className="font-bold text-blue-600 hover:text-indigo-600 transition"
                  >
                    {isLogin ? 'Regístrate aquí' : 'Inicia sesión aquí'}
                  </button>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Nota de seguridad */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-center text-xs text-gray-500 flex items-center justify-center space-x-1"
          >
            <Lock className="w-3 h-3" />
            <span>Conexión cifrada • Base de datos MySQL segura</span>
          </motion.p>
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="fixed bottom-0 left-0 right-0 bg-white/70 backdrop-blur-xl border-t border-gray-100 py-4 z-40"
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs text-gray-500">
            © 2025 <span className="font-semibold text-blue-600">Ética en IA</span> • 
            Plataforma educativa para la gobernanza ética de inteligencia artificial
          </p>
        </div>
      </motion.footer>
    </>
  );
}

export default AuthPage;