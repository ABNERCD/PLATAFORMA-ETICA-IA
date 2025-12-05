import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  PlusCircle, BookOpen, Video, FileText, Type, // <--- ¡AQUÍ FALTABA "Type"!
  FolderPlus, CheckCircle, AlertTriangle, Layers, 
  LayoutDashboard, RefreshCw
} from "lucide-react";
import { courseService } from "../services/api";

function AdminCursos() {
  const [coursesList, setCoursesList] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [courseForm, setCourseForm] = useState({ titulo: "", descripcion: "" });
  const [lessonForm, setLessonForm] = useState({
    curso_id: "",
    titulo: "",
    tipo: "video",
    contenido_texto: "",
    material: null,
  });
  
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    refreshCourses();
  }, []);

  const refreshCourses = async () => {
    setLoading(true);
    try {
      const data = await courseService.getAll();
      setCoursesList(data);
    } catch (error) {
      console.error("Error al cargar lista de cursos", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });
    try {
      const response = await courseService.create(courseForm);
      setMessage({ 
        text: `¡Curso "${courseForm.titulo}" creado correctamente!`, 
        type: 'success' 
      });
      setCourseForm({ titulo: "", descripcion: "" });
      refreshCourses();
    } catch (error) {
      setMessage({ 
        text: "Error: " + (error.response?.data?.message || "No se pudo crear el curso"), 
        type: 'error' 
      });
    }
  };

  const handleLessonSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    if (!lessonForm.curso_id) {
      setMessage({ text: "Selecciona un curso primero.", type: 'error' });
      return;
    }

    const formData = new FormData();
    formData.append("curso_id", lessonForm.curso_id);
    formData.append("titulo", lessonForm.titulo);
    formData.append("tipo", lessonForm.tipo);
    formData.append("contenido_texto", lessonForm.contenido_texto);

    if (lessonForm.tipo === "archivo" && lessonForm.material) {
      formData.append("material", lessonForm.material);
    }

    try {
      await courseService.addLesson(lessonForm.curso_id, formData);
      setMessage({ text: "Contenido agregado exitosamente.", type: 'success' });
      setLessonForm(prev => ({ ...prev, titulo: "", contenido_texto: "", material: null }));
    } catch (error) {
      setMessage({ 
        text: "Error: " + (error.response?.data?.message || "No se pudo agregar la lección"), 
        type: 'error' 
      });
    }
  };

  const handleCourseChange = (e) => setCourseForm({ ...courseForm, [e.target.name]: e.target.value });
  const handleLessonChange = (e) => setLessonForm({ ...lessonForm, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setLessonForm({ ...lessonForm, material: e.target.files[0] });

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto space-y-12">

        {/* --- HEADER DASHBOARD --- */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <LayoutDashboard className="w-8 h-8 text-indigo-600" />
              Panel de Administración
            </h1>
            <p className="text-slate-500 mt-1">Gestión de contenido educativo y cursos.</p>
          </div>
          
          {/* Tarjeta de Resumen Rápido */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Total Cursos</p>
              <p className="text-2xl font-bold text-slate-900">{coursesList.length}</p>
            </div>
            <button onClick={refreshCourses} className="ml-4 p-2 hover:bg-slate-100 rounded-full transition" title="Recargar datos">
              <RefreshCw className={`w-5 h-5 text-slate-400 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* --- NOTIFICACIONES --- */}
        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl flex items-center gap-3 shadow-sm border-l-4 ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-800 border-green-500' 
                : 'bg-red-50 text-red-800 border-red-500'
            }`}
          >
            {message.type === 'success' ? <CheckCircle className="w-5 h-5 flex-shrink-0"/> : <AlertTriangle className="w-5 h-5 flex-shrink-0"/>}
            <span className="font-medium">{message.text}</span>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* ===============================================================
              COLUMNA IZQUIERDA: CREAR CURSO (4 Columnas)
             =============================================================== */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-4 space-y-6"
          >
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
              <div className="bg-slate-900 p-6 text-white">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <FolderPlus className="w-5 h-5 text-indigo-400" /> 
                  Nuevo Curso
                </h2>
                <p className="text-slate-400 text-xs mt-1">Crea un contenedor para tus lecciones.</p>
              </div>
              
              <form onSubmit={handleCourseSubmit} className="p-6 space-y-5">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Título del Curso</label>
                  <input
                    type="text"
                    name="titulo"
                    value={courseForm.titulo}
                    onChange={handleCourseChange}
                    className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium"
                    placeholder="Ej: Ética Digital"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Descripción</label>
                  <textarea
                    name="descripcion"
                    value={courseForm.descripcion}
                    onChange={handleCourseChange}
                    className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all resize-none h-32 text-sm"
                    placeholder="Resumen del contenido..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-200 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <PlusCircle className="w-5 h-5" />
                  <span>Publicar Curso</span>
                </button>
              </form>
            </div>

            {/* LISTA RÁPIDA DE CURSOS EXISTENTES */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
              <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4 text-slate-400" /> 
                Cursos Activos
              </h3>
              <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                {coursesList.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">No hay cursos aún.</p>
                ) : (
                  coursesList.map(c => (
                    <div key={c.curso_id} className="text-sm p-3 bg-slate-50 rounded-lg flex justify-between items-center group hover:bg-indigo-50 transition">
                      <span className="font-medium text-slate-700 truncate max-w-[180px]">{c.titulo}</span>
                      <span className="text-xs bg-white px-2 py-1 rounded border text-slate-400">ID: {c.curso_id}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>

          {/* ===============================================================
              COLUMNA DERECHA: AGREGAR CONTENIDO (8 Columnas)
             =============================================================== */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-8"
          >
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100 h-full">
              <div className="bg-white border-b border-slate-100 p-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Agregar Contenido</h2>
                  <p className="text-slate-500 text-xs">Añade videos, lecturas o archivos a tus cursos.</p>
                </div>
              </div>

              <div className="p-8">
                <form onSubmit={handleLessonSubmit} className="space-y-6">
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* SELECTOR DE CURSO */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase block">Seleccionar Curso</label>
                      <div className="relative">
                        <select
                          name="curso_id"
                          value={lessonForm.curso_id}
                          onChange={handleLessonChange}
                          className="w-full p-3.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-green-500 outline-none appearance-none font-medium text-slate-700"
                          required
                        >
                          <option value="">-- Selecciona el curso --</option>
                          {coursesList.map((curso) => (
                            <option key={curso.curso_id} value={curso.curso_id}>
                              {curso.titulo}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">▼</div>
                      </div>
                    </div>

                    {/* TÍTULO LECCIÓN */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase block">Título del Tema</label>
                      <input
                        type="text"
                        name="titulo"
                        value={lessonForm.titulo}
                        onChange={handleLessonChange}
                        className="w-full p-3.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-white transition-all font-medium"
                        placeholder="Ej: Historia de la IA"
                        required
                      />
                    </div>
                  </div>

                  {/* TIPO DE CONTENIDO (Tabs Visuales) */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase block">Tipo de Material</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'video', icon: Video, label: 'Video' },
                        { id: 'texto', icon: Type, label: 'Texto' },
                        { id: 'archivo', icon: FileText, label: 'Archivo' }
                      ].map((type) => (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setLessonForm({ ...lessonForm, tipo: type.id })}
                          className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                            lessonForm.tipo === type.id 
                              ? 'border-green-500 bg-green-50 text-green-700 shadow-sm' 
                              : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <type.icon className="w-6 h-6 mb-2" />
                          <span className="text-xs font-bold">{type.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* INPUTS DINÁMICOS */}
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 animate-in fade-in slide-in-from-top-2">
                    {(lessonForm.tipo === "video" || lessonForm.tipo === "texto") && (
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase block flex items-center gap-2">
                          {lessonForm.tipo === "video" ? <><Video className="w-3 h-3"/> URL del Video (YouTube)</> : <><Type className="w-3 h-3"/> Contenido de Lectura</>}
                        </label>
                        <textarea
                          name="contenido_texto"
                          value={lessonForm.contenido_texto}
                          onChange={handleLessonChange}
                          className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
                          rows={4}
                          placeholder={lessonForm.tipo === "video" ? "https://youtube.com/watch?v=..." : "Escribe el contenido educativo aquí..."}
                        />
                      </div>
                    )}

                    {lessonForm.tipo === "archivo" && (
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase block">Subir Documento (PDF/Img)</label>
                        <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-white hover:bg-slate-50 transition cursor-pointer relative">
                          <input
                            type="file"
                            name="material"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <div className="pointer-events-none">
                            <FolderPlus className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                            <p className="text-sm text-slate-500 font-medium">
                              {lessonForm.material ? lessonForm.material.name : "Arrastra o selecciona un archivo"}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-8 py-3.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold shadow-lg shadow-green-500/30 active:scale-95 transition-all flex items-center gap-2"
                    >
                      <PlusCircle className="w-5 h-5" />
                      <span>Guardar Lección</span>
                    </button>
                  </div>

                </form>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}

export default AdminCursos;