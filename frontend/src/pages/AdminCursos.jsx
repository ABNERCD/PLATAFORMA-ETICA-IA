import { useState } from 'react';
import { courseService } from '../services/api';

function AdminCursos() {
  const [courseForm, setCourseForm] = useState({ titulo: '', descripcion: '' });
  const [lessonForm, setLessonForm] = useState({
    curso_id: '', // El ID del curso al que se añade la lección
    titulo: '',
    tipo: 'video', // 'video', 'texto', 'archivo'
    contenido_texto: '', // Para URL de video o texto plano
    material: null // Para el archivo
  });
  const [message, setMessage] = useState('');

  // Manejar creación de curso
  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await courseService.create(courseForm);
      setMessage(`Curso creado con ID: ${response.curso_id}. Ahora puedes añadir lecciones.`);
      // Opcional: limpiar formulario
      setCourseForm({ titulo: '', descripcion: '' });
    } catch (error) {
      setMessage('Error al crear curso: ' + error.response.data.message);
    }
  };

  // Manejar creación de lección
  const handleLessonSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Crear el objeto FormData
    const formData = new FormData();
    formData.append('curso_id', lessonForm.curso_id);
    formData.append('titulo', lessonForm.titulo);
    formData.append('tipo', lessonForm.tipo);
    formData.append('contenido_texto', lessonForm.contenido_texto);
    
    // 2. Adjuntar el archivo solo si el tipo es 'archivo'
    if (lessonForm.tipo === 'archivo' && lessonForm.material) {
      formData.append('material', lessonForm.material); // 'material' debe coincidir con upload.single()
    }

    try {
      await courseService.addLesson(lessonForm.curso_id, formData);
      setMessage('Lección añadida con éxito');
      // Opcional: limpiar formulario
      setLessonForm({ ...lessonForm, titulo: '', contenido_texto: '', material: null });
    } catch (error) {
      setMessage('Error al añadir lección: ' + error.response.data.message);
    }
  };

  // Manejadores de cambios
  const handleCourseChange = (e) => {
    setCourseForm({ ...courseForm, [e.target.name]: e.target.value });
  };
  
  const handleLessonChange = (e) => {
    setLessonForm({ ...lessonForm, [e.target.name]: e.target.value });
  };
  
  const handleFileChange = (e) => {
    setLessonForm({ ...lessonForm, material: e.target.files[0] });
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Panel de Administración de Cursos</h1>
      {message && <div className="bg-blue-100 text-blue-800 p-3 mb-4 rounded">{message}</div>}

      {/* --- FORMULARIO DE CREAR CURSO --- */}
      <form onSubmit={handleCourseSubmit} className="mb-12 p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">1. Crear Nuevo Curso</h2>
        <div className="mb-4">
          <label className="block mb-2">Título del Curso</label>
          <input
            type="text"
            name="titulo"
            value={courseForm.titulo}
            onChange={handleCourseChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Descripción</label>
          <textarea
            name="descripcion"
            value={courseForm.descripcion}
            onChange={handleCourseChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded font-semibold">
          Crear Curso
        </button>
      </form>

      {/* --- FORMULARIO DE AÑADIR LECCIÓN --- */}
      <form onSubmit={handleLessonSubmit} className="p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">2. Añadir Lección a Curso</h2>
        
        <div className="mb-4">
          <label className="block mb-2">ID del Curso</label>
          <input
            type="number"
            name="curso_id"
            value={lessonForm.curso_id}
            onChange={handleLessonChange}
            className="w-full p-2 border rounded"
            placeholder="El ID del curso que acabas de crear"
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-2">Título de la Lección</label>
          <input
            type="text"
            name="titulo"
            value={lessonForm.titulo}
            onChange={handleLessonChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Tipo de Lección</label>
          <select name="tipo" value={lessonForm.tipo} onChange={handleLessonChange} className="w-full p-2 border rounded">
            <option value="video">Video (URL)</option>
            <option value="texto">Texto</option>
            <option value="archivo">Archivo (PDF, DOCX, etc.)</option>
          </select>
        </div>

        {/* Campo condicional para Video o Texto */}
        {(lessonForm.tipo === 'video' || lessonForm.tipo === 'texto') && (
          <div className="mb-4">
            <label className="block mb-2">Contenido (URL de video o Texto)</label>
            <textarea
              name="contenido_texto"
              value={lessonForm.contenido_texto}
              onChange={handleLessonChange}
              className="w-full p-2 border rounded"
              placeholder={lessonForm.tipo === 'video' ? 'https://www.youtube.com/watch?v=...' : 'Escribe tu lección...'}
            />
          </div>
        )}

        {/* Campo condicional para Archivo */}
        {lessonForm.tipo === 'archivo' && (
          <div className="mb-4">
            <label className="block mb-2">Subir Archivo</label>
            <input
              type="file"
              name="material"
              onChange={handleFileChange}
              className="w-full p-2 border rounded"
            />
          </div>
        )}

        <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded font-semibold">
          Añadir Lección
        </button>
      </form>
    </div>
  );
}

export default AdminCursos;