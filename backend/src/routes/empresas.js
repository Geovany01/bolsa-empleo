const router = require('express').Router();
const { verificarToken, verificarRol } = require('../middleware/auth');
const db = require('../config/database');

// GET /api/empresas/mis-ofertas — Ofertas de la empresa
router.get('/mis-ofertas', verificarToken, verificarRol('empresa'), async (req, res) => {
  try {
    const [empresa] = await db.query('SELECT id FROM empresa WHERE usuario_id = ?', [req.usuario.id]);
    if (empresa.length === 0) return res.status(404).json({ error: 'Empresa no encontrada' });
    const [rows] = await db.query(
      `SELECT o.*, (SELECT COUNT(*) FROM postulacion WHERE oferta_id = o.id) as total_postulantes 
       FROM oferta o WHERE o.empresa_id = ? ORDER BY o.created_at DESC`, [empresa[0].id]);
    res.json(rows);
  } catch (error) { res.status(500).json({ error: 'Error al obtener ofertas' }); }
});

// GET /api/empresas/postulantes/:ofertaId — Postulantes de una oferta
router.get('/postulantes/:ofertaId', verificarToken, verificarRol('empresa'), async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT p.*, u.nombre, u.email FROM postulacion p 
       JOIN usuario u ON p.estudiante_id = u.id WHERE p.oferta_id = ? ORDER BY p.created_at DESC`,
      [req.params.ofertaId]);
    res.json(rows);
  } catch (error) { res.status(500).json({ error: 'Error al obtener postulantes' }); }
});

// PATCH /api/empresas/postulacion/:id/estado — Cambiar estado postulación
router.patch('/postulacion/:id/estado', verificarToken, verificarRol('empresa'), async (req, res) => {
  try {
    const { estado } = req.body;
    if (!['enviada', 'vista', 'rechazada'].includes(estado)) return res.status(400).json({ error: 'Estado inválido' });
    await db.query('UPDATE postulacion SET estado = ? WHERE id = ?', [estado, req.params.id]);
    res.json({ mensaje: 'Estado actualizado' });
  } catch (error) { res.status(500).json({ error: 'Error al actualizar estado' }); }
});

module.exports = router;
