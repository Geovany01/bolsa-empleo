import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/AuthContext';

const MODALIDADES = [
  { value: '', label: 'Cualquier modalidad' },
  { value: 'presencial', label: 'Presencial' },
  { value: 'remota', label: 'Remota' },
  { value: 'hibrida', label: 'Híbrida' },
];

const TIPOS = [
  { value: '', label: 'Cualquier tipo' },
  { value: 'tiempo_completo', label: 'Tiempo completo' },
  { value: 'medio_tiempo', label: 'Medio tiempo' },
  { value: 'pasantia', label: 'Pasantía' },
];

export default function Ofertas() {
  const [ofertas, setOfertas] = useState([]);
  const [filtros, setFiltros] = useState({ q: '', modalidad: '', tipo: '' });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (filtros.q) params.set('q', filtros.q);
      if (filtros.modalidad) params.set('modalidad', filtros.modalidad);
      if (filtros.tipo) params.set('tipo', filtros.tipo);
      const data = await api(`/ofertas${params.toString() ? '?' + params.toString() : ''}`);
      setOfertas(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargar(); /* eslint-disable-next-line */ }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    cargar();
  };

  const limpiar = () => {
    setFiltros({ q: '', modalidad: '', tipo: '' });
    setTimeout(cargar, 0);
  };

  return (
    <div className="container page">
      <h1 style={{ marginBottom: 16 }}>Ofertas laborales</h1>

      <form onSubmit={onSubmit} className="search-bar">
        <input
          type="text"
          className="form-input"
          placeholder="Buscar por título o descripción..."
          value={filtros.q}
          onChange={(e) => setFiltros({ ...filtros, q: e.target.value })}
        />
        <button type="submit" className="btn btn-primary">Buscar</button>
      </form>

      <div className="filters">
        <select
          className="form-select"
          style={{ maxWidth: 220 }}
          value={filtros.modalidad}
          onChange={(e) => { setFiltros({ ...filtros, modalidad: e.target.value }); setTimeout(cargar, 0); }}
        >
          {MODALIDADES.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
        </select>
        <select
          className="form-select"
          style={{ maxWidth: 220 }}
          value={filtros.tipo}
          onChange={(e) => { setFiltros({ ...filtros, tipo: e.target.value }); setTimeout(cargar, 0); }}
        >
          {TIPOS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
        {(filtros.q || filtros.modalidad || filtros.tipo) && (
          <button type="button" className="btn" onClick={limpiar}>Limpiar filtros</button>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {cargando ? (
        <div className="loading">Cargando ofertas...</div>
      ) : ofertas.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', color: '#888' }}>
          No hay ofertas disponibles con esos filtros.
        </div>
      ) : (
        ofertas.map((o) => <OfertaCard key={o.id} oferta={o} />)
      )}
    </div>
  );
}

function OfertaCard({ oferta }) {
  return (
    <Link to={`/ofertas/${oferta.id}`} style={{ display: 'block' }}>
      <div className="card" style={{ cursor: 'pointer' }}>
        <div className="card-title">{oferta.titulo}</div>
        <div className="card-subtitle">{oferta.nombre_empresa}</div>
        <div className="card-body" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {oferta.descripcion}
        </div>
        <div className="card-footer">
          <div style={{ display: 'flex', gap: 6 }}>
            <span className="badge badge-info">{etiquetaModalidad(oferta.modalidad)}</span>
            <span className="badge badge-info">{etiquetaTipo(oferta.tipo_contratacion)}</span>
            {oferta.categoria && <span className="badge badge-info">{oferta.categoria}</span>}
          </div>
          <span>Vigente hasta {formatearFecha(oferta.fecha_vigencia)}</span>
        </div>
      </div>
    </Link>
  );
}

function etiquetaModalidad(m) {
  return { presencial: 'Presencial', remota: 'Remota', hibrida: 'Híbrida' }[m] || m;
}
function etiquetaTipo(t) {
  return { tiempo_completo: 'Tiempo completo', medio_tiempo: 'Medio tiempo', pasantia: 'Pasantía' }[t] || t;
}
function formatearFecha(f) {
  if (!f) return '';
  return new Date(f).toLocaleDateString('es-GT', { day: '2-digit', month: 'short', year: 'numeric' });
}