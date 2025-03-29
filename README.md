# Ayritech-Internship

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
