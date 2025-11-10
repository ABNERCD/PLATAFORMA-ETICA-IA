// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// --- Importa TODAS tus páginas ---
import HomePage from './pages/HomePage';        // La que acabamos de mover
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import AdminCursos from './pages/AdminCursos';  // <-- ¡ESTA FALTABA!

// App Principal (Ahora limpio y fácil de leer)
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin-cursos" element={<AdminCursos />} /> 
      </Routes>
    </Router>
  );
}

export default App;