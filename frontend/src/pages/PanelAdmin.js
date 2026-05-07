import React, { useEffect, useState } from 'react';
import { NavLink, Routes, Route, Navigate } from 'react-router-dom';
import { api } from '../services/AuthContext';

export default function PanelAdmin() {
  return (
    <div className="container page">
      <h1 style={{ marginBottom: 16 }}>Panel administrativo</h1>

      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid #e8e8e8', marginBottom: 20 }}>
        <TabLink to="/admin/empresas">Empresas pendientes</TabLink>
        <TabLink to="/admin/ofertas">Ofertas</TabLink>
        <TabLink to="/admin/usuarios">Usuarios</TabLink>
      </div>

      <Routes>
        <Route index element={<Navigate to="empresas" replace />} />
        <Route path="empresas" element={<EmpresasPendientes />} />
        <Route path="ofertas" element={<OfertasModeracion />} />
        <Route path="usuarios" element={<UsuariosLista />} />
      </Routes>
    </div>
  );
}

function TabLink({ to, children }) {
  return (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        padding: '8px 14px',
        fontSize: 14,
        color: isActive ? '#1a1a1a' : '#888',
        borderBottom: isActive ? '2px solid #1a1a1a' : '2px solid transparent',
        marginBottom: -1,
        textDecoration: 'none',
      })}
    >
      {children}
    </NavLink>
  );
}

function EmpresasPendientes() {
  const [empresas, setEmpresas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const cargar = () => {
    setCargando(true);
    api('/admin/empresas/pendientes')
      .then(setEmpresas)
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false));
  };

  useEffect(cargar, []);

  const decidir = async (id, estado) => {
    try {
      await api(`/admin/empresas/${id}/estado`, {
        method: 'PATCH',
        body: JSON.stringify({ estado }),
      });
      setEmpresas((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  if (cargando) return <div className="loading">Cargando...</div>;
  if (error) return <div className="alert alert-error">{error}</div>;

  if (empresas.length === 0) {
    return <div className="card" style={{ textAlign: 'center', color: '#888' }}>No hay empresas pendientes de aprobación.</div>;
  }

  return empresas.map((e) => (
    <div key={e.id} className="card">
      <div className="card-title">{e.nombre_empresa}</div>
      <div className="card-subtitle">
        {e.sector} · Contacto: {e.nombre} ({e.email})
        {e.sitio_web && <> · <a href={e.sitio_web} target="_blank" rel="noreferrer" style={{ textDecoration: 'underline' }}>{e.sitio_web}</a></>}
      </div>
      {e.descripcion && <p className="card-body">{e.descripcion}</p>}
      <div className="card-footer" style={{ marginTop: 12 }}>
        <span>Solicitada: {formatearFecha(e.created_at)}</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-sm btn-success" onClick={() => decidir(e.id, 'aprobada')}>Aprobar</button>
          <button className="btn btn-sm btn-danger" onClick={() => decidir(e.id, 'rechazada')}>Rechazar</button>
        </div>
      </div>
    </div>
  ));
}

function OfertasModeracion() {
  const [ofertas, setOfertas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/admin/ofertas')
      .then(setOfertas)
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false));
  }, []);

  const desactivar = async (id) => {
    if (!window.confirm('¿Desactivar esta oferta? Dejará de ser visible para los estudiantes.')) return;
    try {
      await api(`/admin/ofertas/${id}`, { method: 'DELETE' });
      setOfertas((prev) => prev.map((o) => o.id === id ? { ...o, activa: 0 } : o));
    } catch (err) {
      alert(err.message);
    }
  };

  if (cargando) return <div className="loading">Cargando...</div>;
  if (error) return <div className="alert alert-error">{error}</div>;

  if (ofertas.length === 0) {
    return <div className="card" style={{ textAlign: 'center', color: '#888' }}>No hay ofertas publicadas.</div>;
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Oferta</th>
            <th>Empresa</th>
            <th>Vigencia</th>
            <th>Estado</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {ofertas.map((o) => (
            <tr key={o.id}>
              <td>{o.titulo}</td>
              <td>{o.nombre_empresa}</td>
              <td>{formatearFecha(o.fecha_vigencia)}</td>
              <td>
                <span className={`badge ${o.activa ? 'badge-active' : 'badge-rejected'}`}>
                  {o.activa ? 'Activa' : 'Desactivada'}
                </span>
              </td>
              <td>
                {!!o.activa && (
                  <button className="btn btn-sm btn-danger" onClick={() => desactivar(o.id)}>Desactivar</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function UsuariosLista() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/admin/usuarios')
      .then(setUsuarios)
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false));
  }, []);

  const cambiarActivo = async (id, activo) => {
    try {
      await api(`/admin/usuarios/${id}/activo`, {
        method: 'PATCH',
        body: JSON.stringify({ activo }),
      });
      setUsuarios((prev) => prev.map((u) => u.id === id ? { ...u, activo } : u));
    } catch (err) {
      alert(err.message);
    }
  };

  if (cargando) return <div className="loading">Cargando...</div>;
  if (error) return <div className="alert alert-error">{error}</div>;

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Registrado</th>
            <th>Estado</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              <td>{u.nombre}</td>
              <td>{u.email}</td>
              <td><span className="badge badge-info">{etiquetaRol(u.rol)}</span></td>
              <td>{formatearFecha(u.created_at)}</td>
              <td>
                <span className={`badge ${u.activo ? 'badge-active' : 'badge-rejected'}`}>
                  {u.activo ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td>
                {u.rol !== 'admin' && (
                  <button
                    className={`btn btn-sm ${u.activo ? 'btn-danger' : 'btn-success'}`}
                    onClick={() => cambiarActivo(u.id, u.activo ? 0 : 1)}
                  >
                    {u.activo ? 'Desactivar' : 'Activar'}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function etiquetaRol(r) {
  return { estudiante: 'Estudiante', empresa: 'Empresa', admin: 'Admin' }[r] || r;
}
function formatearFecha(f) {
  if (!f) return '';
  return new Date(f).toLocaleDateString('es-GT', { day: '2-digit', month: 'short', year: 'numeric' });
}