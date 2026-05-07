import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/AuthContext';

export default function MisPostulaciones() {
  const [postulaciones, setPostulaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/postulaciones/mis')
      .then(setPostulaciones)
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false));
  }, []);

  return (
    <div className="container page">
      <h1 style={{ marginBottom: 16 }}>Mis postulaciones</h1>

      {error && <div className="alert alert-error">{error}</div>}

      {cargando ? (
        <div className="loading">Cargando...</div>
      ) : postulaciones.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', color: '#888' }}>
          Aún no te has postulado a ninguna oferta. <Link to="/" style={{ textDecoration: 'underline' }}>Ver ofertas disponibles</Link>.
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Oferta</th>
                <th>Empresa</th>
                <th>Postulado</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {postulaciones.map((p) => (
                <tr key={p.id}>
                  <td>
                    <Link to={`/ofertas/${p.oferta_id}`} style={{ textDecoration: 'underline' }}>{p.titulo}</Link>
                  </td>
                  <td>{p.nombre_empresa}</td>
                  <td>{formatearFecha(p.created_at)}</td>
                  <td><BadgeEstado estado={p.estado} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function BadgeEstado({ estado }) {
  const map = {
    enviada: { cls: 'badge-pending', txt: 'Enviada' },
    vista: { cls: 'badge-active', txt: 'Vista por la empresa' },
    rechazada: { cls: 'badge-rejected', txt: 'Rechazada' },
  };
  const { cls, txt } = map[estado] || { cls: 'badge-info', txt: estado };
  return <span className={`badge ${cls}`}>{txt}</span>;
}

function formatearFecha(f) {
  if (!f) return '';
  return new Date(f).toLocaleDateString('es-GT', { day: '2-digit', month: 'short', year: 'numeric' });
}