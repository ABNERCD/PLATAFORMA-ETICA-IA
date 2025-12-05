import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  CheckCircle, PlayCircle, FileText, Download, 
  ChevronLeft, ChevronRight, Menu, X, 
  Award, BookOpen, MonitorPlay, File, Circle, Trophy, Star
} from 'lucide-react';
import { courseService } from '../services/api';

function CursoPlayer() {
  const { curso_id } = useParams();
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [curso, setCurso] = useState(null);
  const [lecciones, setLecciones] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  
  const contentRef = useRef(null);
  const canvasRef = useRef(null);
  const [canComplete, setCanComplete] = useState(false);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    setUser(currentUser);
    loadCourseContent();
  }, [curso_id]);

  useEffect(() => {
    if (activeLesson) {
      setCanComplete(activeLesson.completada);
      
      if (activeLesson.tipo === 'video' && !activeLesson.completada) {
        const timer = setTimeout(() => setCanComplete(true), 5000);
        return () => clearTimeout(timer);
      }
      
      if (activeLesson.tipo === 'archivo') {
         const ext = getFileExtension(activeLesson.contenido);
         if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
            setCanComplete(true);
         }
      }
      
      if (contentRef.current) {
        contentRef.current.scrollTop = 0;
      }
    }
  }, [activeLesson]);

  const loadCourseContent = async () => {
    try {
      const data = await courseService.getCourseContent(curso_id);
      setCurso(data.curso);
      setLecciones(data.lecciones);
      
      if (data.lecciones.length > 0) {
        setActiveLesson(data.lecciones[0]);
      }
    } catch (error) {
      console.error("Error cargando curso:", error);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async () => {
    if (!canComplete && !activeLesson.completada) return;

    try {
      const response = await courseService.toggleLesson(curso_id, activeLesson.leccion_id);
      
      const newLecciones = lecciones.map(l => 
        l.leccion_id === activeLesson.leccion_id 
          ? { ...l, completada: response.completada } 
          : l
      );
      setLecciones(newLecciones);
      setActiveLesson({ ...activeLesson, completada: response.completada });

      const allCompleted = newLecciones.every(l => l.completada);
      if (allCompleted && response.completada) {
        setShowCertificateModal(true);
      }

    } catch (error) {
      console.error("Error al actualizar progreso", error);
    }
  };

  // --- GENERADOR DE CERTIFICADO PREMIUM ---
  const generateCertificate = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Configuración de alta resolución
    const width = 2000;
    const height = 1400;
    canvas.width = width;
    canvas.height = height;

    // 1. FONDO TIPO PAPEL
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#FEFCF5"); // Crema muy claro
    gradient.addColorStop(1, "#F3F4F6"); // Gris muy suave
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // 2. MARCO ORNAMENTAL
    const padding = 60;
    
    // Marco exterior azul
    ctx.lineWidth = 20;
    ctx.strokeStyle = "#1e3a8a"; // Azul oscuro institucional
    ctx.strokeRect(padding, padding, width - (padding * 2), height - (padding * 2));

    // Marco interior dorado fino
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#d97706"; // Dorado
    ctx.strokeRect(padding + 25, padding + 25, width - (padding * 2) - 50, height - (padding * 2) - 50);

    // 3. MARCA DE AGUA (ESCUDO FONDO)
    ctx.save();
    ctx.globalAlpha = 0.05; // Muy transparente
    ctx.fillStyle = "#1e3a8a";
    ctx.translate(width / 2, height / 2);
    // Dibujo simple de escudo
    ctx.beginPath();
    ctx.moveTo(0, -300);
    ctx.quadraticCurveTo(300, -300, 300, 0);
    ctx.quadraticCurveTo(300, 300, 0, 500);
    ctx.quadraticCurveTo(-300, 300, -300, 0);
    ctx.quadraticCurveTo(-300, -300, 0, -300);
    ctx.fill();
    ctx.restore();

    // 4. TEXTOS
    ctx.textAlign = "center";
    
    // Encabezado
    ctx.fillStyle = "#1e3a8a";
    ctx.font = "bold 80px 'Times New Roman', serif";
    ctx.fillText("CONSTANCIA DE COMPETENCIA", width / 2, 300);

    // Línea decorativa debajo del título
    ctx.beginPath();
    ctx.moveTo(width / 2 - 200, 330);
    ctx.lineTo(width / 2 + 200, 330);
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#d97706";
    ctx.stroke();

    // Texto introductorio
    ctx.fillStyle = "#4b5563";
    ctx.font = "40px sans-serif";
    ctx.fillText("La Plataforma de Ética en IA otorga el presente reconocimiento a:", width / 2, 450);

    // NOMBRE DEL ALUMNO (Destacado)
    ctx.fillStyle = "#111827"; // Casi negro
    ctx.font = "bold italic 120px 'Times New Roman', serif";
    const alumnoNombre = user?.nombre || "Alumno";
    ctx.fillText(alumnoNombre, width / 2, 600);

    // Línea debajo del nombre
    ctx.beginPath();
    ctx.moveTo(width / 2 - 600, 620);
    ctx.lineTo(width / 2 + 600, 620);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#9ca3af";
    ctx.stroke();

    // Texto cuerpo
    ctx.fillStyle = "#4b5563";
    ctx.font = "40px sans-serif";
    ctx.fillText("Por haber concluido y aprobado satisfactoriamente el curso:", width / 2, 750);

    // NOMBRE DEL CURSO
    ctx.fillStyle = "#1d4ed8"; // Azul vibrante
    ctx.font = "bold 90px sans-serif";
    const cursoTitulo = curso?.titulo || "Curso de Ética";
    // Ajuste simple si el título es muy largo
    if (cursoTitulo.length > 30) ctx.font = "bold 70px sans-serif";
    ctx.fillText(`"${cursoTitulo}"`, width / 2, 900);

    // FECHA
    const date = new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });
    ctx.fillStyle = "#6b7280";
    ctx.font = "30px sans-serif";
    ctx.fillText(`Expedido el ${date}`, width / 2, 1050);

    // 5. SELLO DE AUTENTICIDAD (DIBUJADO)
    // Coordenadas para el sello (esquina inferior derecha)
    const sealX = width - 300;
    const sealY = height - 300;

    ctx.save();
    ctx.translate(sealX, sealY);
    
    // Cintas del sello
    ctx.fillStyle = "#b45309";
    ctx.beginPath();
    ctx.moveTo(-50, 80);
    ctx.lineTo(-100, 200);
    ctx.lineTo(-50, 180);
    ctx.lineTo(0, 200);
    ctx.lineTo(50, 80);
    ctx.fill();

    // Círculo dentado (Gold)
    ctx.beginPath();
    const radius = 120;
    for (let i = 0; i < 30; i++) {
        const angle = (i / 30) * Math.PI * 2;
        const r = i % 2 === 0 ? radius : radius - 15;
        ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
    }
    ctx.closePath();
    ctx.fillStyle = "#fbbf24"; // Dorado claro
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#d97706"; // Dorado oscuro
    ctx.stroke();

    // Círculo interior
    ctx.beginPath();
    ctx.arc(0, 0, 90, 0, Math.PI * 2);
    ctx.strokeStyle = "#d97706";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Texto en el sello
    ctx.rotate(-Math.PI / 6);
    ctx.fillStyle = "#92400e";
    ctx.font = "bold 25px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("CERTIFICADO", 0, -10);
    ctx.fillText("OFICIAL", 0, 20);
    
    ctx.restore();

    // 6. DESCARGAR
    const link = document.createElement('a');
    link.download = `Certificado-${user?.nombre}-${curso?.titulo}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // --- NAVEGACIÓN ---
  const handleNext = () => {
    const currentIndex = lecciones.findIndex(l => l.leccion_id === activeLesson.leccion_id);
    if (currentIndex < lecciones.length - 1) setActiveLesson(lecciones[currentIndex + 1]);
  };

  const handlePrev = () => {
    const currentIndex = lecciones.findIndex(l => l.leccion_id === activeLesson.leccion_id);
    if (currentIndex > 0) setActiveLesson(lecciones[currentIndex - 1]);
  };

  const handleScroll = (e) => {
    if (activeLesson?.tipo !== 'video' && !activeLesson?.completada) {
      const { scrollTop, scrollHeight, clientHeight } = e.target;
      if (scrollTop + clientHeight >= scrollHeight - 50) setCanComplete(true);
    }
  };

  // --- HELPERS Y RENDERIZADORES ---
  const getVideoEmbedUrl = (url) => {
    if (!url) return "";
    const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
    return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
  };

  const getFileExtension = (filename) => filename ? filename.split('.').pop().toLowerCase() : '';

  const getLessonIcon = (tipo) => {
    switch(tipo) {
      case 'video': return <MonitorPlay className="w-4 h-4" />;
      case 'archivo': return <FileText className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const renderFileViewer = () => {
    if (!activeLesson?.contenido) return null;
    const fileUrl = `http://localhost:5000${activeLesson.contenido}`;
    const extension = getFileExtension(activeLesson.contenido);

    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
      return (
        <div className="flex flex-col items-center bg-gray-100 rounded-xl p-4">
          <img src={fileUrl} alt="Material" className="max-w-full h-auto rounded shadow-sm" />
        </div>
      );
    }
    if (extension === 'pdf') {
      return (
        <div className="flex flex-col h-full w-full min-h-[600px] bg-gray-800 rounded-xl overflow-hidden shadow-lg">
          <object data={fileUrl} type="application/pdf" className="w-full h-full flex-1">
            <div className="flex flex-col items-center justify-center h-full text-white p-6 text-center">
              <p className="mb-4">Tu navegador no puede mostrar este PDF directamente.</p>
              <a href={fileUrl} target="_blank" rel="noreferrer" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">Descargar PDF</a>
            </div>
          </object>
        </div>
      );
    }
    return (
      <div className="p-12 flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50/50">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
          <Download className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">Archivo Descargable</h3>
        <p className="text-gray-500 mb-6 text-sm">Este formato ({extension}) requiere descarga.</p>
        <a href={fileUrl} target="_blank" rel="noreferrer" className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200">
          <span>Descargar {extension.toUpperCase()}</span>
        </a>
      </div>
    );
  };

  const completedCount = lecciones.filter(l => l.completada).length;
  const progressPercent = lecciones.length > 0 ? Math.round((completedCount / lecciones.length) * 100) : 0;
  const currentIndex = lecciones.findIndex(l => l?.leccion_id === activeLesson?.leccion_id);
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === lecciones.length - 1;

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      
      {/* CANVAS OCULTO */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* --- MODAL DE CERTIFICADO (DISEÑO MEJORADO) --- */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-1 overflow-hidden animate-in fade-in zoom-in duration-300 relative">
            
            {/* Efecto de borde degradado */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 opacity-20"></div>
            
            <div className="relative bg-white rounded-[22px] p-8 md:p-12 text-center">
              
              <div className="absolute top-4 right-4">
                <button onClick={() => setShowCertificateModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition">
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <div className="mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-8 ring-white">
                  <Trophy className="w-12 h-12 text-yellow-600 drop-shadow-sm" />
                </div>
                <h2 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">¡Curso Completado!</h2>
                <div className="flex justify-center items-center gap-2 mb-4">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                </div>
                <p className="text-lg text-gray-600">
                  Felicidades, <span className="font-bold text-gray-900">{user?.nombre}</span>. Has demostrado tu competencia en:
                </p>
                <p className="text-2xl font-bold text-blue-700 mt-2">"{curso?.titulo}"</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button 
                  onClick={generateCertificate}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-700 to-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3"
                >
                  <Award className="w-6 h-6" /> 
                  Descargar Diploma Oficial
                </button>
              </div>
              
              <p className="mt-6 text-sm text-gray-400">
                Tu certificado ha sido generado con fecha de hoy.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <aside 
        className={`bg-white border-r border-gray-200 w-80 flex-shrink-0 flex flex-col transition-all duration-300 absolute md:relative z-30 h-full shadow-2xl md:shadow-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-0 md:opacity-0 md:overflow-hidden'
        }`}
      >
        <div className="p-6 border-b border-gray-100 bg-white">
          <button onClick={() => navigate('/dashboard')} className="text-xs font-bold text-gray-400 hover:text-blue-600 flex items-center mb-4 transition uppercase tracking-wider">
            <ChevronLeft className="w-3 h-3 mr-1"/> Volver al Dashboard
          </button>
          <h2 className="font-extrabold text-gray-900 text-xl leading-tight mb-4">{curso?.titulo}</h2>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-medium text-gray-500">
              <span>Tu Progreso</span>
              <span className={progressPercent === 100 ? 'text-green-600 font-bold' : 'text-blue-600'}>{progressPercent}%</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 transition-all duration-700 ease-out rounded-full" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {progressPercent === 100 && (
              <button 
                onClick={() => setShowCertificateModal(true)}
                className="w-full mt-4 text-sm flex items-center justify-center gap-2 text-white font-bold bg-gradient-to-r from-yellow-500 to-amber-600 hover:to-amber-700 py-3 rounded-xl shadow-md transition-all transform hover:scale-[1.02]"
              >
                <Award className="w-4 h-4" /> Obtener Certificado
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar bg-gray-50/50">
          {lecciones.map((leccion, index) => {
            const isActive = activeLesson?.leccion_id === leccion.leccion_id;
            return (
              <button
                key={leccion.leccion_id}
                onClick={() => {
                  setActiveLesson(leccion);
                  if (window.innerWidth < 768) setSidebarOpen(false);
                }}
                className={`group w-full text-left p-3.5 rounded-xl flex items-start space-x-3 transition-all duration-200 border ${
                  isActive 
                    ? 'bg-white border-blue-200 shadow-md ring-1 ring-blue-100' 
                    : 'bg-transparent border-transparent hover:bg-white hover:border-gray-200 hover:shadow-sm'
                }`}
              >
                <div className={`mt-0.5 flex-shrink-0 transition-colors ${
                  leccion.completada ? 'text-green-500' : isActive ? 'text-blue-500' : 'text-gray-300 group-hover:text-gray-400'
                }`}>
                  {leccion.completada ? <CheckCircle className="w-5 h-5 fill-green-50" /> : 
                   isActive ? <PlayCircle className="w-5 h-5 fill-blue-50" /> :
                   <Circle className="w-5 h-5" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Lección {index + 1}</span>
                    <span className="text-gray-400">{getLessonIcon(leccion.tipo)}</span>
                  </div>
                  <p className={`font-semibold text-sm leading-snug truncate ${isActive ? 'text-blue-900' : 'text-gray-600'}`}>
                    {leccion.titulo}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-full relative w-full bg-slate-50">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 md:px-8 justify-between shadow-sm z-20 flex-shrink-0">
          <div className="flex items-center min-w-0 gap-3">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition focus:outline-none"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="h-6 w-px bg-gray-200 mx-2 hidden md:block"></div>
            <h1 className="text-lg font-bold text-gray-800 truncate hidden md:block">{activeLesson?.titulo}</h1>
          </div>
          
          <div className="flex items-center gap-3">
            {activeLesson?.completada && (
              <span className="bg-green-100 text-green-700 text-xs px-3 py-1.5 rounded-full font-bold flex items-center shadow-sm">
                <CheckCircle className="w-3 h-3 mr-1.5" />
                Completada
              </span>
            )}
          </div>
        </header>

        <div 
          className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth" 
          onScroll={handleScroll}
          ref={contentRef}
        >
          <div className="max-w-5xl mx-auto pb-24">
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden min-h-[500px] flex flex-col transition-all">
              {activeLesson?.tipo === 'video' && (
                <div className="aspect-video bg-black w-full group relative">
                  <iframe 
                    className="w-full h-full"
                    src={getVideoEmbedUrl(activeLesson.contenido)}
                    title={activeLesson.titulo}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
              {activeLesson?.tipo === 'texto' && (
                <div className="p-8 md:p-12 lg:p-16 max-w-3xl mx-auto">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 border-b pb-4">{activeLesson.titulo}</h1>
                  <article className="prose prose-slate prose-lg max-w-none text-gray-600 leading-loose">
                    <div className="whitespace-pre-wrap font-serif">
                      {activeLesson.contenido}
                    </div>
                  </article>
                </div>
              )}
              {activeLesson?.tipo === 'archivo' && (
                <div className="flex-1 flex flex-col bg-slate-50/50">
                  <div className="p-4 border-b bg-white flex justify-between items-center">
                    <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                      <File className="w-4 h-4 text-blue-500"/>
                      Recurso Educativo
                    </h3>
                  </div>
                  <div className="flex-1 p-4 md:p-8">
                    {renderFileViewer()}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="h-20 bg-white border-t border-gray-200 flex items-center justify-between px-4 md:px-8 z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <button 
            onClick={handlePrev}
            disabled={isFirst}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition ${
              isFirst ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden md:inline">Anterior</span>
          </button>

          <button
            onClick={handleToggleComplete}
            disabled={!canComplete && !activeLesson.completada}
            className={`flex items-center space-x-2 px-6 md:px-10 py-3 rounded-full font-bold text-sm md:text-base transition-all transform active:scale-95 ${
              activeLesson?.completada 
                ? 'bg-green-100 text-green-700 border border-green-200'
                : canComplete
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-300 hover:bg-blue-700 hover:-translate-y-0.5'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {activeLesson?.completada ? (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Completado</span>
              </>
            ) : (
              <>
                <span>Marcar como Visto</span>
                {!canComplete && <span className="ml-2 text-xs opacity-70">(Lee para avanzar)</span>}
              </>
            )}
          </button>

          <button 
            onClick={handleNext}
            disabled={isLast}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition ${
              isLast ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <span className="hidden md:inline">Siguiente</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </main>
    </div>
  );
}

export default CursoPlayer;