-- Seeds - Datos de prueba
-- Ejecutar después de la migración: mysql -u root -p bolsa_empleo < seeds/001_data.sql

USE bolsa_empleo;

-- Admin (password: admin123)
INSERT INTO usuario (nombre, email, password, rol, activo) VALUES
('Administrador', 'admin@universidad.edu.gt', '$2a$10$8K1p/EqEOZxKGQKUHqDMGe0X5Y8.kX5t5z5Y8.kX5t5z5Y8.kX5', 'admin', TRUE);

-- Nota: el hash de arriba es placeholder. Generar con bcrypt en la app o usar:
-- node -e "require('bcryptjs').hash('admin123', 10).then(console.log)"
