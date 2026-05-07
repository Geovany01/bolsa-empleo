const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const passport = require('../config/passport');
const db = require('../config/database');

// --- Google OAuth para estudiantes ---
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login?error=dominio` }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user.id, email: req.user.email, rol: req.user.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  }
);

// --- Registro de empresas ---
router.post('/registro/empresa', async (req, res) => {
  try {
    const { email, password, nombre, nombre_empresa, descripcion, sector, sitio_web } = req.body;

    // Verificar email único
    const [existing] = await db.query('SELECT id FROM usuario WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(400).json({ error: 'Email ya registrado' });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario tipo empresa
    const [userResult] = await db.query(
      'INSERT INTO usuario (nombre, email, password, rol, activo) VALUES (?, ?, ?, ?, ?)',
      [nombre, email, hashedPassword, 'empresa', true]
    );

    // Crear ficha de empresa (estado pendiente)
    await db.query(
      'INSERT INTO empresa (usuario_id, nombre_empresa, descripcion, sector, sitio_web, estado) VALUES (?, ?, ?, ?, ?, ?)',
      [userResult.insertId, nombre_empresa, descripcion, sector, sitio_web, 'pendiente']
    );

    res.status(201).json({ mensaje: 'Registro exitoso. Pendiente de aprobación.' });
  } catch (error) {
    res.status(500).json({ error: 'Error en el registro' });
  }
});

// --- Login de empresas ---
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await db.query('SELECT u.*, e.estado as empresa_estado FROM usuario u LEFT JOIN empresa e ON u.id = e.usuario_id WHERE u.email = ?', [email]);

    if (rows.length === 0) return res.status(401).json({ error: 'Credenciales inválidas' });

    const usuario = rows[0];
    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) return res.status(401).json({ error: 'Credenciales inválidas' });

    if (usuario.rol === 'empresa' && usuario.empresa_estado !== 'aprobada') {
      return res.status(403).json({ error: 'Empresa pendiente de aprobación' });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({ token, usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol } });
  } catch (error) {
    res.status(500).json({ error: 'Error en login' });
  }
});

// --- Info del usuario actual ---
router.get('/me', require('../middleware/auth').verificarToken, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, nombre, email, rol FROM usuario WHERE id = ?', [req.usuario.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
});

module.exports = router;
