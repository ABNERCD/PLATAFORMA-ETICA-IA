// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// --- Importación de Páginas ---
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import AdminCursos from './pages/AdminCursos';
import CursoPlayer from './pages/CursoPlayer'; // <--- 1. ¡ESTA IMPORTACIÓN FALTABA!

// App Principal
function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta Pública (Inicio) */}
        <Route path="/" element={<HomePage />} />
        
        {/* Ruta de Autenticación */}
        <Route path="/auth" element={<AuthPage />} />
        
        {/* Rutas Protegidas (Estudiantes) */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* 2. ¡ESTA RUTA FALTABA! Es la que carga el reproductor del curso */}
        {/* ":curso_id" permite que la URL cambie (ej: /curso/1, /curso/5) */}
        <Route path="/curso/:curso_id" element={<CursoPlayer />} />

        {/* Rutas Protegidas (Admin/Instructor) */}
        <Route path="/admin-cursos" element={<AdminCursos />} /> 
      </Routes>
    </Router>
  );
}

export default App;