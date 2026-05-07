const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const { verificarToken, verificarRol } = require('../middleware/auth');
const db = require('../config/database');

const storage = multer.diskStorage({
  destination: 'uploads/cv/',
  filename: (req, file, cb) => cb(null, `cv_${Date.now()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage, fileFilter: (req, file, cb) => {
  cb(null, file.mimetype === 'application/pdf');
}, limits: { fileSize: 5 * 1024 * 1024 } });

// POST /api/postulaciones — Postularse a oferta (estudiante)
router.post('/', verificarToken, verificarRol('estudiante'), upload.single('cv'), async (req, res) => {
  try {
    const { oferta_id } = req.body;
    const [existing] = await db.query('SELECT id FROM postulacion WHERE oferta_id = ? AND estudiante_id = ?', [oferta_id, req.usuario.id]);
    if (existing.length > 0) return res.status(400).json({ error: 'Ya te postulaste a esta oferta' });
    await db.query(
      'INSERT INTO postulacion (oferta_id, estudiante_id, cv_path, estado) VALUES (?,?,?,?)',
      [oferta_id, req.usuario.id, req.file ? req.file.path : null, 'enviada']
    );
    res.status(201).json({ mensaje: 'Postulación enviada' });
  } catch (error) { res.status(500).json({ error: 'Error al postularse' }); }
});

// GET /api/postulaciones/mis — Historial del estudiante
router.get('/mis', verificarToken, verificarRol('estudiante'), async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT p.*, o.titulo, e.nombre_empresa FROM postulacion p 
       JOIN oferta o ON p.oferta_id = o.id JOIN empresa e ON o.empresa_id = e.id 
       WHERE p.estudiante_id = ? ORDER BY p.created_at DESC`, [req.usuario.id]);
    res.json(rows);
  } catch (error) { res.status(500).json({ error: 'Error al obtener postulaciones' }); }
});

module.exports = router;
