import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { api, useAuth } from '../services/AuthContext';

const ESTADO_INICIAL = {
  nombre: '',
  email: '',
  password: '',
  password2: '',
  nombre_empresa: '',
  sector: '',
  sitio_web: '',
  descripcion: '',
};

const SECTORES = ['Tecnología', 'Finanzas', 'Salud', 'Educación', 'Comercio', 'Industria', 'Consultoría', 'Otro'];

export default function RegistroEmpresa() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(ESTADO_INICIAL);

  if (usuario) {
    const destino = usuario.rol === 'empresa' ? '/empresa' : usuario.rol === 'admin' ? '/admin' : '/';
    return <Navigate to={destino} replace />;
  }

  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [enviando, setEnviando] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (form.password !== form.password2) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setEnviando(true);
    try {
      const { password2, ...payload } = form;
      await api('/auth/registro/empresa', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setExito('Registro enviado. Tu cuenta queda pendiente de aprobación por un administrador. Te avisaremos cuando puedas ingresar.');
      setForm(ESTADO_INICIAL);
      setTimeout(() => navigate('/login'), 3500);
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="container page" style={{ maxWidth: 560 }}>
      <h1 style={{ marginBottom: 8 }}>Registro de empresa</h1>
      <p style={{ color: '#666', marginBottom: 20 }}>Crea tu cuenta para publicar ofertas. Será revisada por un administrador antes de activarse.</p>

      {error && <div className="alert alert-error">{error}</div>}
      {exito && <div className="alert alert-success">{exito}</div>}

      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="nombre_empresa">Nombre de la empresa</label>
          <input id="nombre_empresa" name="nombre_empresa" className="form-input" value={form.nombre_empresa} onChange={onChange} required />
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label htmlFor="sector">Sector</label>
            <select id="sector" name="sector" className="form-select" value={form.sector} onChange={onChange} required>
              <option value="">Selecciona...</option>
              {SECTORES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="sitio_web">Sitio web (opcional)</label>
            <input id="sitio_web" name="sitio_web" type="url" className="form-input" value={form.sitio_web} onChange={onChange} placeholder="https://..." />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="descripcion">Descripción de la empresa</label>
          <textarea id="descripcion" name="descripcion" className="form-input" rows={3} value={form.descripcion} onChange={onChange} required />
        </div>

        <h3 style={{ marginTop: 24, marginBottom: 12, fontSize: 15, color: '#555' }}>Datos de contacto</h3>

        <div className="form-group">
          <label htmlFor="nombre">Nombre del responsable</label>
          <input id="nombre" name="nombre" className="form-input" value={form.nombre} onChange={onChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" className="form-input" value={form.email} onChange={onChange} required autoComplete="email" />
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input id="password" name="password" type="password" className="form-input" value={form.password} onChange={onChange} required minLength={6} autoComplete="new-password" />
          </div>
          <div className="form-group">
            <label htmlFor="password2">Repetir contraseña</label>
            <input id="password2" name="password2" type="password" className="form-input" value={form.password2} onChange={onChange} required minLength={6} autoComplete="new-password" />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={enviando} style={{ width: '100%', marginTop: 8 }}>
          {enviando ? 'Enviando...' : 'Crear cuenta'}
        </button>
      </form>

      <p style={{ marginTop: 20, fontSize: 14, color: '#666', textAlign: 'center' }}>
        ¿Ya tienes cuenta? <Link to="/login" style={{ textDecoration: 'underline' }}>Inicia sesión</Link>
      </p>
    </div>
  );
}