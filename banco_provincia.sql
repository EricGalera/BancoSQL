CREATE DATABASE IF NOT EXISTS banco_provincia
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE banco_provincia;

DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  usuario VARCHAR(50) NOT NULL UNIQUE,
  clave_hash VARCHAR(255) NOT NULL,
  tipo_documento VARCHAR(20) DEFAULT NULL,
  numero_documento VARCHAR(30) DEFAULT NULL,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO usuarios (usuario, clave_hash, tipo_documento, numero_documento)
VALUES (
  'alumno',
  '$2y$10$owbpNGoPxmrnbMIMn9aGDucWd5tzDM/M..DOiDopWicq9HM8GB2K2',
  'DNI',
  '30111222'
)
ON DUPLICATE KEY UPDATE
  clave_hash = VALUES(clave_hash),
  tipo_documento = VALUES(tipo_documento),
  numero_documento = VALUES(numero_documento);
