import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';

const ETIQUETAS_ROL = {
  estudiante: 'Estudiante',
  empresa: 'Empresa',
  admin: 'Admin',
};

export default function Navbar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const enlaceHome = () => {
    if (!usuario) return '/';
    if (usuario.rol === 'empresa') return '/empresa';
    if (usuario.rol === 'admin') return '/admin';
    return '/';
  };

  return (
    <nav className="navbar">
      <Link to={enlaceHome()} className="navbar-brand">Bolsa de Empleo</Link>
      <div className="navbar-links">
        <Link to="/">Ofertas</Link>
        {usuario?.rol === 'estudiante' && <Link to="/mis-postulaciones">Mis postulaciones</Link>}
        {usuario?.rol === 'empresa' && <Link to="/empresa">Mi panel</Link>}
        {usuario?.rol === 'admin' && <Link to="/admin">Panel admin</Link>}

        {usuario ? (
          <>
            <span style={{ color: '#888', fontSize: 13 }}>
              {usuario.nombre} <span className="badge badge-info">{ETIQUETAS_ROL[usuario.rol] || usuario.rol}</span>
            </span>
            <button className="btn btn-sm" onClick={onLogout}>Salir</button>
          </>
        ) : (
          <Link to="/login" className="btn btn-sm">Ingresar</Link>
        )}
      </div>
    </nav>
  );
}