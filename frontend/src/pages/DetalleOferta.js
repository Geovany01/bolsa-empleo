import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, useAuth } from '../services/AuthContext';

export default function DetalleOferta() {
  const { id } = useParams();
  const { usuario } = useAuth();
  const [oferta, setOferta] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api(`/ofertas/${id}`)
      .then(setOferta)
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false));
  }, [id]);

  if (cargando) return <div className="loading">Cargando...</div>;
  if (error) return (
    <div className="container page">
      <div className="alert alert-error">{error}</div>
      <Link to="/" className="btn">Volver a ofertas</Link>
    </div>
  );
  if (!oferta) return null;

  return (
    <div className="container page" style={{ maxWidth: 760 }}>
      <Link to="/" style={{ fontSize: 13, color: '#888' }}>← Volver a ofertas</Link>

      <h1 style={{ marginTop: 12 }}>{oferta.titulo}</h1>
      <p style={{ color: '#666', marginBottom: 12 }}>
        {oferta.nombre_empresa}
        {oferta.sector && <span style={{ color: '#aaa' }}> · {oferta.sector}</span>}
      </p>

      <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
        <span className="badge badge-info">{etiquetaModalidad(oferta.modalidad)}</span>
        <span className="badge badge-info">{etiquetaTipo(oferta.tipo_contratacion)}</span>
        {oferta.categoria && <span className="badge badge-info">{oferta.categoria}</span>}
        <span className="badge badge-pending">Vigente hasta {formatearFecha(oferta.fecha_vigencia)}</span>
      </div>

      <div className="card">
        <h3 style={{ fontSize: 15, marginBottom: 8 }}>Descripción</h3>
        <p style={{ whiteSpace: 'pre-wrap', color: '#444' }}>{oferta.descripcion}</p>

        {oferta.requisitos && (
          <>
            <h3 style={{ fontSize: 15, marginTop: 18, marginBottom: 8 }}>Requisitos</h3>
            <p style={{ whiteSpace: 'pre-wrap', color: '#444' }}>{oferta.requisitos}</p>
          </>
        )}
      </div>

      <SeccionPostulacion oferta={oferta} usuario={usuario} />
    </div>
  );
}

function SeccionPostulacion({ oferta, usuario }) {
  const [cv, setCv] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState('');
  const [error, setError] = useState('');

  if (!usuario) {
    return (
      <div className="card" style={{ marginTop: 20 }}>
        <p style={{ color: '#666' }}>
          Para postularte, <Link to="/login" style={{ textDecoration: 'underline' }}>inicia sesión</Link> con tu cuenta institucional.
        </p>
      </div>
    );
  }

  if (usuario.rol !== 'estudiante') {
    return (
      <div className="card" style={{ marginTop: 20, color: '#888' }}>
        Solo los estudiantes pueden postularse a las ofertas.
      </div>
    );
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setExito('');

    if (!cv) {
      setError('Debes adjuntar tu CV en PDF.');
      return;
    }
    if (cv.type !== 'application/pdf') {
      setError('El archivo debe ser un PDF.');
      return;
    }
    if (cv.size > 5 * 1024 * 1024) {
      setError('El CV no debe pesar más de 5 MB.');
      return;
    }

    setEnviando(true);
    try {
      const formData = new FormData();
      formData.append('oferta_id', oferta.id);
      formData.append('cv', cv);
      await api('/postulaciones', { method: 'POST', body: formData });
      setExito('Postulación enviada. La empresa verá tu CV.');
      setCv(null);
      e.target.reset();
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="card" style={{ marginTop: 20 }}>
      <h3 style={{ fontSize: 15, marginBottom: 12 }}>Postularme a esta oferta</h3>

      {exito && <div className="alert alert-success">{exito}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="cv">Tu CV (PDF, máximo 5 MB)</label>
          <input
            id="cv"
            type="file"
            accept="application/pdf"
            className="form-input"
            onChange={(e) => setCv(e.target.files[0] || null)}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={enviando}>
          {enviando ? 'Enviando...' : 'Postular'}
        </button>
      </form>
    </div>
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