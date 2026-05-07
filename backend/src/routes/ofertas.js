// backend/src/routes/ofertas.js
const router = require('express').Router();
const { verificarToken, verificarRol } = require('../middleware/auth');
const db = require('../config/database');

// GET /api/ofertas — Listar ofertas activas (público)
router.get('/', async (req, res) => {
  try {
    const { categoria, modalidad, tipo, q } = req.query;
    let sql = `SELECT o.*, e.nombre_empresa FROM oferta o JOIN empresa e ON o.empresa_id = e.id WHERE o.activa = 1 AND o.fecha_vigencia >= CURDATE()`;
    const params = [];
    if (categoria) { sql += ' AND o.categoria = ?'; params.push(categoria); }
    if (modalidad) { sql += ' AND o.modalidad = ?'; params.push(modalidad); }
    if (tipo) { sql += ' AND o.tipo_contratacion = ?'; params.push(tipo); }
    if (q) { sql += ' AND (o.titulo LIKE ? OR o.descripcion LIKE ?)'; params.push(`%${q}%`, `%${q}%`); }
    sql += ' ORDER BY o.created_at DESC';
    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (error) { res.status(500).json({ error: 'Error al listar ofertas' }); }
});

// GET /api/ofertas/:id — Detalle de oferta
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT o.*, e.nombre_empresa, e.sector FROM oferta o JOIN empresa e ON o.empresa_id = e.id WHERE o.id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Oferta no encontrada' });
    res.json(rows[0]);
  } catch (error) { res.status(500).json({ error: 'Error al obtener oferta' }); }
});

// POST /api/ofertas — Crear oferta (empresa)
router.post('/', verificarToken, verificarRol('empresa'), async (req, res) => {
  try {
    const [empresa] = await db.query('SELECT id FROM empresa WHERE usuario_id = ? AND estado = ?', [req.usuario.id, 'aprobada']);
    if (empresa.length === 0) return res.status(403).json({ error: 'Empresa no aprobada' });
    const { titulo, descripcion, requisitos, modalidad, tipo_contratacion, categoria, fecha_vigencia } = req.body;
    const [result] = await db.query(
      'INSERT INTO oferta (empresa_id, titulo, descripcion, requisitos, modalidad, tipo_contratacion, categoria, fecha_vigencia, activa) VALUES (?,?,?,?,?,?,?,?,1)',
      [empresa[0].id, titulo, descripcion, requisitos, modalidad, tipo_contratacion, categoria, fecha_vigencia]
    );
    res.status(201).json({ id: result.insertId, mensaje: 'Oferta creada' });
  } catch (error) { res.status(500).json({ error: 'Error al crear oferta' }); }
});

// PUT /api/ofertas/:id — Editar oferta (empresa dueña)
router.put('/:id', verificarToken, verificarRol('empresa'), async (req, res) => {
  try {
    const { titulo, descripcion, requisitos, modalidad, tipo_contratacion, categoria, fecha_vigencia, activa } = req.body;
    await db.query(
      'UPDATE oferta SET titulo=?, descripcion=?, requisitos=?, modalidad=?, tipo_contratacion=?, categoria=?, fecha_vigencia=?, activa=? WHERE id=?',
      [titulo, descripcion, requisitos, modalidad, tipo_contratacion, categoria, fecha_vigencia, activa, req.params.id]
    );
    res.json({ mensaje: 'Oferta actualizada' });
  } catch (error) { res.status(500).json({ error: 'Error al actualizar oferta' }); }
});

module.exports = router;
