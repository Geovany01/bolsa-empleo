import React, { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { api, useAuth } from '../services/AuthContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export default function Login() {
  const { usuario, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const queryError = new URLSearchParams(location.search).get('error');

  if (usuario) return <Navigate to={destinoPorRol(usuario.rol)} replace />;

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setEnviando(true);
    try {
      const { token, usuario: u } = await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      login(token, u);
      navigate(destinoPorRol(u.rol), { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="container page" style={{ maxWidth: 420 }}>
      <h1 style={{ marginBottom: 8 }}>Iniciar sesión</h1>
      <p style={{ color: '#666', marginBottom: 20 }}>Bolsa de Empleo Universitaria</p>

      {queryError === 'dominio' && (
        <div className="alert alert-error">Solo se permiten cuentas con dominio institucional.</div>
      )}

      <a href={`${API_URL}/auth/google`} className="btn" style={{ display: 'block', textAlign: 'center', marginBottom: 24 }}>
        Continuar con Google (estudiantes)
      </a>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '24px 0', color: '#aaa', fontSize: 12 }}>
        <div style={{ flex: 1, height: 1, background: '#eee' }} />
        <span>O ingresa como empresa</span>
        <div style={{ flex: 1, height: 1, background: '#eee' }} />
      </div>

      <form onSubmit={onSubmit}>
        {error && <div className="alert alert-error">{error}</div>}

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            className="form-input"
            value={form.email}
            onChange={onChange}
            required
            autoComplete="email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            name="password"
            type="password"
            className="form-input"
            value={form.password}
            onChange={onChange}
            required
            autoComplete="current-password"
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={enviando}>
          {enviando ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>

      <p style={{ marginTop: 20, fontSize: 14, color: '#666', textAlign: 'center' }}>
        ¿Eres una empresa nueva? <Link to="/registro/empresa" style={{ color: '#1a1a1a', textDecoration: 'underline' }}>Regístrate aquí</Link>
      </p>
    </div>
  );
}

function destinoPorRol(rol) {
  if (rol === 'empresa') return '/empresa';
  if (rol === 'admin') return '/admin';
  return '/';
}