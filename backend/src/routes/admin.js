const router = require('express').Router();
const { verificarToken, verificarRol } = require('../middleware/auth');
const db = require('../config/database');

// GET /api/admin/empresas/pendientes
router.get('/empresas/pendientes', verificarToken, verificarRol('admin'), async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT e.*, u.nombre, u.email FROM empresa e JOIN usuario u ON e.usuario_id = u.id WHERE e.estado = 'pendiente'`);
    res.json(rows);
  } catch (error) { res.status(500).json({ error: 'Error al obtener solicitudes' }); }
});

// PATCH /api/admin/empresas/:id/estado
router.patch('/empresas/:id/estado', verificarToken, verificarRol('admin'), async (req, res) => {
  try {
    const { estado } = req.body;
    if (!['aprobada', 'rechazada'].includes(estado)) return res.status(400).json({ error: 'Estado inválido' });
    await db.query('UPDATE empresa SET estado = ? WHERE id = ?', [estado, req.params.id]);
    res.json({ mensaje: `Empresa ${estado}` });
  } catch (error) { res.status(500).json({ error: 'Error al actualizar empresa' }); }
});

// GET /api/admin/ofertas — Todas las ofertas para moderación
router.get('/ofertas', verificarToken, verificarRol('admin'), async (req, res) => {
  try {
    const [rows] = await db.query('SELECT o.*, e.nombre_empresa FROM oferta o JOIN empresa e ON o.empresa_id = e.id ORDER BY o.created_at DESC');
    res.json(rows);
  } catch (error) { res.status(500).json({ error: 'Error al obtener ofertas' }); }
});

// DELETE /api/admin/ofertas/:id
router.delete('/ofertas/:id', verificarToken, verificarRol('admin'), async (req, res) => {
  try {
    await db.query('UPDATE oferta SET activa = 0 WHERE id = ?', [req.params.id]);
    res.json({ mensaje: 'Oferta desactivada' });
  } catch (error) { res.status(500).json({ error: 'Error al desactivar oferta' }); }
});

// GET /api/admin/usuarios
router.get('/usuarios', verificarToken, verificarRol('admin'), async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, nombre, email, rol, activo, created_at FROM usuario ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) { res.status(500).json({ error: 'Error al obtener usuarios' }); }
});

// PATCH /api/admin/usuarios/:id/activo
router.patch('/usuarios/:id/activo', verificarToken, verificarRol('admin'), async (req, res) => {
  try {
    const { activo } = req.body;
    await db.query('UPDATE usuario SET activo = ? WHERE id = ?', [activo, req.params.id]);
    res.json({ mensaje: `Usuario ${activo ? 'activado' : 'desactivado'}` });
  } catch (error) { res.status(500).json({ error: 'Error al actualizar usuario' }); }
});

module.exports = router;
