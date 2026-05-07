import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './services/AuthContext';

// Pages
import Login from './pages/Login';
import RegistroEmpresa from './pages/RegistroEmpresa';
import AuthCallback from './pages/AuthCallback';
import Ofertas from './pages/Ofertas';
import DetalleOferta from './pages/DetalleOferta';
import MisPostulaciones from './pages/MisPostulaciones';
import PanelEmpresa from './pages/PanelEmpresa';
import PanelAdmin from './pages/PanelAdmin';

// Components
import Navbar from './components/Navbar';

// Styles
import './styles/global.css';

function ProtectedRoute({ children, roles }) {
  const { usuario, loading } = useAuth();
  if (loading) return <div className="loading">Cargando...</div>;
  if (!usuario) return <Navigate to="/login" />;
  if (roles && !roles.includes(usuario.rol)) return <Navigate to="/" />;
  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/registro/empresa" element={<RegistroEmpresa />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/" element={<Ofertas />} />
          <Route path="/ofertas/:id" element={<DetalleOferta />} />

          {/* Estudiante */}
          <Route path="/mis-postulaciones" element={
            <ProtectedRoute roles={['estudiante']}><MisPostulaciones /></ProtectedRoute>
          } />

          {/* Empresa */}
          <Route path="/empresa/*" element={
            <ProtectedRoute roles={['empresa']}><PanelEmpresa /></ProtectedRoute>
          } />

          {/* Admin */}
          <Route path="/admin/*" element={
            <ProtectedRoute roles={['admin']}><PanelAdmin /></ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
