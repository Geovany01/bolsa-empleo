-- Seeds - Datos de prueba
-- Ejecutar después de la migración: mysql -u root -p bolsa_empleo < seeds/001_data.sql

USE bolsa_empleo;

-- Admin (password: admin123)
INSERT INTO usuario (nombre, email, password, rol, activo) VALUES
('Administrador', 'admin@universidad.edu.gt', '$2a$10$yZVhOaMfw2LgCsXR.0jw7.cwYU3m7ljpCNAcTgizvkVqnL/BWJkVi', 'admin', TRUE);
