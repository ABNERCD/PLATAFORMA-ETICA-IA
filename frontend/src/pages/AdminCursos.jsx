import { useState } from "react";
import { motion } from "framer-motion";
import { courseService } from "../services/api";

function AdminCursos() {
  const [courseForm, setCourseForm] = useState({ titulo: "", descripcion: "" });
  const [lessonForm, setLessonForm] = useState({
    curso_id: "",
    titulo: "",
    tipo: "video",
    contenido_texto: "",
    material: null,
  });
  const [message, setMessage] = useState("");

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await courseService.create(courseForm);
      setMessage(`Curso creado con ID: ${response.curso_id}. Ahora puedes añadir lecciones.`);
      setCourseForm({ titulo: "", descripcion: "" });
    } catch (error) {
      setMessage("Error al crear curso: " + error.response.data.message);
    }
  };

  const handleLessonSubmit = async (e) => {
    e.preventDefault();

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
      setMessage("Lección añadida con éxito");
      setLessonForm({ ...lessonForm, titulo: "", contenido_texto: "", material: null });
    } catch (error) {
      setMessage("Error al añadir lección: " + error.response.data.message);
    }
  };

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
    <div className="max-w-5xl mx-auto p-8 space-y-12">

      {/* ---------- TÍTULO PRINCIPAL ---------- */}
      <motion.h1
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-5xl font-extrabold text-center bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent drop-shadow-lg"
      >
        Panel de Administración de Cursos
      </motion.h1>

      {/* ---------- MENSAJE ---------- */}
      {message && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 rounded-xl shadow-md bg-blue-50 text-blue-700 border border-blue-200 text-center font-medium"
        >
          {message}
        </motion.div>
      )}

      {/* ===============================================================
          FORMULARIO DE CREAR CURSO
      =============================================================== */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-xl p-10"
      >
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          1. Crear Nuevo Curso
        </h2>

        <form onSubmit={handleCourseSubmit} className="space-y-6">

          <div>
            <label className="block text-gray-700 font-medium mb-1">Título del Curso</label>
            <input
              type="text"
              name="titulo"
              value={courseForm.titulo}
              onChange={handleCourseChange}
              className="w-full p-3 border rounded-xl shadow focus:ring-4 focus:ring-blue-300 outline-none"
              placeholder="Ej: Introducción a IA Ética"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Descripción</label>
            <textarea
              name="descripcion"
              value={courseForm.descripcion}
              onChange={handleCourseChange}
              className="w-full p-3 border rounded-xl min-h-[130px] shadow focus:ring-4 focus:ring-blue-300 outline-none"
              placeholder="Describe brevemente el contenido del curso..."
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-3 rounded-xl text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg hover:shadow-xl transition"
          >
            Crear Curso
          </motion.button>
        </form>
      </motion.div>

      {/* ===============================================================
          FORMULARIO DE AGREGAR LECCIÓN
      =============================================================== */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-xl p-10"
      >
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          2. Añadir Lección al Curso
        </h2>

        <form onSubmit={handleLessonSubmit} className="space-y-6">

          <div>
            <label className="block text-gray-700 font-medium mb-1">ID del Curso</label>
            <input
              type="number"
              name="curso_id"
              value={lessonForm.curso_id}
              onChange={handleLessonChange}
              className="w-full p-3 border rounded-xl shadow focus:ring-4 focus:ring-indigo-300 outline-none"
              placeholder="Ej: 1, 2, 3..."
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Título de la Lección</label>
            <input
              type="text"
              name="titulo"
              value={lessonForm.titulo}
              onChange={handleLessonChange}
              className="w-full p-3 border rounded-xl shadow focus:ring-4 focus:ring-indigo-300 outline-none"
              placeholder="Ej: Ética en IA — Introducción"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Tipo de Lección</label>
            <select
              name="tipo"
              value={lessonForm.tipo}
              onChange={handleLessonChange}
              className="w-full p-3 border rounded-xl shadow bg-white focus:ring-4 focus:ring-indigo-300 outline-none"
            >
              <option value="video">Video (URL)</option>
              <option value="texto">Texto</option>
              <option value="archivo">Archivo (PDF, DOCX, etc.)</option>
            </select>
          </div>

          {(lessonForm.tipo === "video" || lessonForm.tipo === "texto") && (
            <div>
              <label className="block text-gray-700 font-medium mb-1">Contenido</label>
              <textarea
                name="contenido_texto"
                value={lessonForm.contenido_texto}
                onChange={handleLessonChange}
                className="w-full p-3 border rounded-xl min-h-[130px] shadow focus:ring-4 focus:ring-indigo-300 outline-none"
                placeholder={
                  lessonForm.tipo === "video"
                    ? "Pega aquí la URL del video..."
                    : "Escribe el contenido del texto..."
                }
              />
            </div>
          )}

          {lessonForm.tipo === "archivo" && (
            <div>
              <label className="block text-gray-700 font-medium mb-1">Subir Archivo</label>
              <input
                type="file"
                name="material"
                onChange={handleFileChange}
                className="w-full p-3 border rounded-xl shadow bg-gray-50"
              />
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-3 rounded-xl text-lg font-semibold text-white bg-gradient-to-r from-green-600 to-green-700 shadow-lg hover:shadow-xl transition"
          >
            Añadir Lección
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

export default AdminCursos;
