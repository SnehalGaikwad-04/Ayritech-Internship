CREATE DATABASE certificate_db;
USE certificate_db;

CREATE TABLE templates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    template_name VARCHAR(255) NOT NULL,
    template_data TEXT NOT NULL
);

CREATE TABLE designs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    design_name VARCHAR(255) NOT NULL,
    design_data TEXT NOT NULL
);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE templates_trash (
  id INT AUTO_INCREMENT PRIMARY KEY,
  template_name VARCHAR(255),
  template_data TEXT,
  deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE designs_trash (
  id INT AUTO_INCREMENT PRIMARY KEY,
  design_name VARCHAR(255),
  design_data TEXT,
  deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE templates ADD COLUMN deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE designs ADD COLUMN deleted BOOLEAN DEFAULT FALSE;
