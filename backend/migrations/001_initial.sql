-- Bolsa de Empleo Universitaria - Migración inicial
-- Ejecutar: mysql -u root -p bolsa_empleo < migrations/001_initial.sql

CREATE DATABASE IF NOT EXISTS bolsa_empleo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bolsa_empleo;

CREATE TABLE IF NOT EXISTS usuario (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) DEFAULT NULL,
  rol ENUM('estudiante', 'empresa', 'admin') NOT NULL,
  google_id VARCHAR(255) DEFAULT NULL,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS empresa (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  nombre_empresa VARCHAR(255) NOT NULL,
  descripcion TEXT,
  sector VARCHAR(100),
  sitio_web VARCHAR(255),
  estado ENUM('pendiente', 'aprobada', 'rechazada') DEFAULT 'pendiente',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS oferta (
  id INT AUTO_INCREMENT PRIMARY KEY,
  empresa_id INT NOT NULL,
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT NOT NULL,
  requisitos TEXT,
  modalidad ENUM('presencial', 'remota', 'hibrida') NOT NULL,
  tipo_contratacion ENUM('tiempo_completo', 'medio_tiempo', 'pasantia') NOT NULL,
  categoria VARCHAR(100),
  fecha_vigencia DATE NOT NULL,
  activa BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (empresa_id) REFERENCES empresa(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS postulacion (
  id INT AUTO_INCREMENT PRIMARY KEY,
  oferta_id INT NOT NULL,
  estudiante_id INT NOT NULL,
  cv_path VARCHAR(500),
  estado ENUM('enviada', 'vista', 'rechazada') DEFAULT 'enviada',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (oferta_id) REFERENCES oferta(id) ON DELETE CASCADE,
  FOREIGN KEY (estudiante_id) REFERENCES usuario(id) ON DELETE CASCADE,
  UNIQUE KEY unique_postulacion (oferta_id, estudiante_id)
);

-- Índices
CREATE INDEX idx_oferta_empresa ON oferta(empresa_id);
CREATE INDEX idx_oferta_activa ON oferta(activa, fecha_vigencia);
CREATE INDEX idx_postulacion_oferta ON postulacion(oferta_id);
CREATE INDEX idx_postulacion_estudiante ON postulacion(estudiante_id);
