const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('./database');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      const domain = email.split('@')[1];

      // Verificar dominio institucional
      if (domain !== process.env.GOOGLE_ALLOWED_DOMAIN) {
        return done(null, false, { message: 'Dominio no autorizado' });
      }

      // Buscar o crear usuario
      const [rows] = await db.query('SELECT * FROM usuario WHERE google_id = ?', [profile.id]);

      if (rows.length > 0) {
        return done(null, rows[0]);
      }

      // Crear nuevo estudiante
      const [result] = await db.query(
        'INSERT INTO usuario (nombre, email, rol, google_id, activo) VALUES (?, ?, ?, ?, ?)',
        [profile.displayName, email, 'estudiante', profile.id, true]
      );

      const [newUser] = await db.query('SELECT * FROM usuario WHERE id = ?', [result.insertId]);
      return done(null, newUser[0]);
    } catch (error) {
      return done(error, null);
    }
  }
));

module.exports = passport;
