import React, { useEffect, useState } from 'react';
import { Link, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/AuthContext';

const BACKEND_URL = (process.env.REACT_APP_API_URL || 'http://localhost:3001/api').replace(/\/api\/?$/, '');

const MODALIDADES = ['presencial', 'remota', 'hibrida'];
const TIPOS = ['tiempo_completo', 'medio_tiempo', 'pasantia'];

export default function PanelEmpresa() {
  return (
    <Routes>
      <Route index element={<MisOfertas />} />
      <Route path="nueva" element={<OfertaForm modo="crear" />} />
      <Route path="editar/:id" element={<OfertaForm modo="editar" />} />
      <Route path="oferta/:id/postulantes" element={<Postulantes />} />
    </Routes>
  );
}

function MisOfertas() {
  const [ofertas, setOfertas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/empresas/mis-ofertas')
      .then(setOfertas)
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false));
  }, []);

  return (
    <div className="container page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1>Mis ofertas</h1>
        <Link to="/empresa/nueva" className="btn btn-primary">Nueva oferta</Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {cargando ? (
        <div className="loading">Cargando...</div>
      ) : ofertas.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', color: '#888' }}>
          Aún no has publicado ofertas. <Link to="/empresa/nueva" style={{ textDecoration: 'underline' }}>Crear la primera</Link>.
        </div>
      ) : (
        ofertas.map((o) => (
          <div key={o.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div className="card-title">{o.titulo}</div>
                <div className="card-subtitle">
                  {etiquetaModalidad(o.modalidad)} · {etiquetaTipo(o.tipo_contratacion)} · Vigente hasta {formatearFecha(o.fecha_vigencia)}
                </div>
              </div>
              <span className={`badge ${o.activa ? 'badge-active' : 'badge-rejected'}`}>
                {o.activa ? 'Activa' : 'Cerrada'}
              </span>
            </div>
            <div className="card-footer" style={{ marginTop: 12 }}>
              <span>{o.total_postulantes} postulante{o.total_postulantes === 1 ? '' : 's'}</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <Link to={`/empresa/oferta/${o.id}/postulantes`} className="btn btn-sm">Ver postulantes</Link>
                <Link to={`/empresa/editar/${o.id}`} className="btn btn-sm">Editar</Link>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function OfertaForm({ modo }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    titulo: '', descripcion: '', requisitos: '',
    modalidad: 'presencial', tipo_contratacion: 'tiempo_completo',
    categoria: '', fecha_vigencia: '', activa: true,
  });
  const [cargando, setCargando] = useState(modo === 'editar');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (modo !== 'editar') return;
    api(`/ofertas/${id}`)
      .then((o) => setForm({
        titulo: o.titulo || '',
        descripcion: o.descripcion || '',
        requisitos: o.requisitos || '',
        modalidad: o.modalidad,
        tipo_contratacion: o.tipo_contratacion,
        categoria: o.categoria || '',
        fecha_vigencia: o.fecha_vigencia ? o.fecha_vigencia.slice(0, 10) : '',
        activa: !!o.activa,
      }))
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false));
  }, [id, modo]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setEnviando(true);
    try {
      if (modo === 'crear') {
        const { activa, ...payload } = form;
        await api('/ofertas', { method: 'POST', body: JSON.stringify(payload) });
      } else {
        await api(`/ofertas/${id}`, { method: 'PUT', body: JSON.stringify(form) });
      }
      navigate('/empresa', { replace: true });
    } catch (err) {
      setError(err.message);
      setEnviando(false);
    }
  };

  if (cargando) return <div className="loading">Cargando...</div>;

  return (
    <div className="container page" style={{ maxWidth: 700 }}>
      <Link to="/empresa" style={{ fontSize: 13, color: '#888' }}>← Volver al panel</Link>
      <h1 style={{ marginTop: 12, marginBottom: 16 }}>{modo === 'crear' ? 'Nueva oferta' : 'Editar oferta'}</h1>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="titulo">Título</label>
          <input id="titulo" name="titulo" className="form-input" value={form.titulo} onChange={onChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="descripcion">Descripción</label>
          <textarea id="descripcion" name="descripcion" className="form-input" rows={4} value={form.descripcion} onChange={onChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="requisitos">Requisitos (opcional)</label>
          <textarea id="requisitos" name="requisitos" className="form-input" rows={3} value={form.requisitos} onChange={onChange} />
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label htmlFor="modalidad">Modalidad</label>
            <select id="modalidad" name="modalidad" className="form-select" value={form.modalidad} onChange={onChange}>
              {MODALIDADES.map((m) => <option key={m} value={m}>{etiquetaModalidad(m)}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="tipo_contratacion">Tipo de contratación</label>
            <select id="tipo_contratacion" name="tipo_contratacion" className="form-select" value={form.tipo_contratacion} onChange={onChange}>
              {TIPOS.map((t) => <option key={t} value={t}>{etiquetaTipo(t)}</option>)}
            </select>
          </div>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label htmlFor="categoria">Categoría (opcional)</label>
            <input id="categoria" name="categoria" className="form-input" value={form.categoria} onChange={onChange} placeholder="Ej. Tecnología, Marketing..." />
          </div>
          <div className="form-group">
            <label htmlFor="fecha_vigencia">Vigente hasta</label>
            <input id="fecha_vigencia" name="fecha_vigencia" type="date" className="form-input" value={form.fecha_vigencia} onChange={onChange} required />
          </div>
        </div>

        {modo === 'editar' && (
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" name="activa" checked={form.activa} onChange={onChange} />
              Oferta activa (visible para estudiantes)
            </label>
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button type="submit" className="btn btn-primary" disabled={enviando}>
            {enviando ? 'Guardando...' : modo === 'crear' ? 'Publicar oferta' : 'Guardar cambios'}
          </button>
          <Link to="/empresa" className="btn">Cancelar</Link>
        </div>
      </form>
    </div>
  );
}

function Postulantes() {
  const { id } = useParams();
  const [oferta, setOferta] = useState(null);
  const [postulantes, setPostulantes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const cargar = async () => {
    setCargando(true);
    try {
      const [o, p] = await Promise.all([
        api(`/ofertas/${id}`),
        api(`/empresas/postulantes/${id}`),
      ]);
      setOferta(o);
      setPostulantes(p);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargar(); /* eslint-disable-next-line */ }, [id]);

  const cambiarEstado = async (postulacionId, estado) => {
    try {
      await api(`/empresas/postulacion/${postulacionId}/estado`, {
        method: 'PATCH',
        body: JSON.stringify({ estado }),
      });
      setPostulantes((prev) => prev.map((p) => p.id === postulacionId ? { ...p, estado } : p));
    } catch (err) {
      alert(err.message);
    }
  };

  if (cargando) return <div className="loading">Cargando...</div>;

  return (
    <div className="container page">
      <Link to="/empresa" style={{ fontSize: 13, color: '#888' }}>← Volver al panel</Link>
      <h1 style={{ marginTop: 12 }}>Postulantes</h1>
      {oferta && <p style={{ color: '#666', marginBottom: 20 }}>{oferta.titulo}</p>}

      {error && <div className="alert alert-error">{error}</div>}

      {postulantes.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', color: '#888' }}>
          Aún no hay postulantes para esta oferta.
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Estudiante</th>
                <th>Email</th>
                <th>Postulado</th>
                <th>CV</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {postulantes.map((p) => (
                <tr key={p.id}>
                  <td>{p.nombre}</td>
                  <td>{p.email}</td>
                  <td>{formatearFecha(p.created_at)}</td>
                  <td>
                    {p.cv_path ? (
                      <a href={urlCv(p.cv_path)} target="_blank" rel="noreferrer" style={{ textDecoration: 'underline' }}>Ver PDF</a>
                    ) : <span style={{ color: '#aaa' }}>—</span>}
                  </td>
                  <td><BadgeEstado estado={p.estado} /></td>
                  <td>
                    <select
                      className="form-select"
                      style={{ minWidth: 140 }}
                      value={p.estado}
                      onChange={(e) => cambiarEstado(p.id, e.target.value)}
                    >
                      <option value="enviada">Enviada</option>
                      <option value="vista">Vista</option>
                      <option value="rechazada">Rechazada</option>
                    </select>
                  </td>
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
    vista: { cls: 'badge-active', txt: 'Vista' },
    rechazada: { cls: 'badge-rejected', txt: 'Rechazada' },
  };
  const { cls, txt } = map[estado] || { cls: 'badge-info', txt: estado };
  return <span className={`badge ${cls}`}>{txt}</span>;
}

function urlCv(cvPath) {
  return `${BACKEND_URL}/${cvPath.replace(/\\/g, '/')}`;
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