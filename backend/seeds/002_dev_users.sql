-- Seeds opcionales para desarrollo / testing manual.
-- Crea un estudiante y una empresa ya aprobada para poder probar el flujo
-- completo sin configurar Google OAuth ni esperar aprobación administrativa.
--
-- Aplicar:
--   PowerShell: Get-Content backend\seeds\002_dev_users.sql | mysql -u root -p bolsa_empleo
--   Bash:       mysql -u root -p bolsa_empleo < backend/seeds/002_dev_users.sql
--
-- Los usuarios creados aquí NO deben existir en producción.

USE bolsa_empleo;

-- Estudiante de prueba (password: estudiante123)
-- Permite hacer login desde /login con email/password sin pasar por Google OAuth.
INSERT IGNORE INTO usuario (nombre, email, password, rol, activo) VALUES
('Estudiante de Prueba', 'estudiante@universidad.edu.gt', '$2a$10$15kkSugEp5kiymDua.TT.eHzjXL8uorOETqeWmH/npgq2B/mLBbXG', 'estudiante', TRUE);

-- Empresa de prueba ya aprobada (password: empresa123)
-- Útil si quieres probar el panel de empresa sin pasar por registro + aprobación.
INSERT IGNORE INTO usuario (nombre, email, password, rol, activo) VALUES
('Contacto Empresa Demo', 'empresa@demo.com', '$2a$10$viS4lesotH9bZcsvrP74Dukysn/nez3AErJNBbclLqASytcDAHq/O', 'empresa', TRUE);

INSERT IGNORE INTO empresa (usuario_id, nombre_empresa, descripcion, sector, sitio_web, estado)
SELECT id, 'Empresa Demo', 'Empresa de prueba para desarrollo local.', 'Tecnología', 'https://demo.example.com', 'aprobada'
FROM usuario WHERE email = 'empresa@demo.com'
  AND NOT EXISTS (SELECT 1 FROM empresa WHERE usuario_id = usuario.id);