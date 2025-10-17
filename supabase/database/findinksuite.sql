-- Tabla de usuarios (artistas/tatuadores)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'artist', -- 'artist', 'admin'
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de clientes
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120),
    phone VARCHAR(20),
    style VARCHAR(50), -- estilo preferido
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de citas
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    date TIMESTAMP NOT NULL,
    duration INTEGER, -- minutos
    status VARCHAR(20) DEFAULT 'scheduled', -- 'scheduled', 'completed', 'cancelled'
    notes TEXT
);

-- Tabla de portafolio (trabajos realizados)
CREATE TABLE portfolio (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    client_id INTEGER REFERENCES clients(id) ON DELETE SET NULL,
    image_url TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Etiquetas automáticas (AI tagging) para portafolio
CREATE TABLE portfolio_tags (
    id SERIAL PRIMARY KEY,
    portfolio_id INTEGER REFERENCES portfolio(id) ON DELETE CASCADE,
    tag VARCHAR(50) NOT NULL
);

-- Historial de visitas de clientes
CREATE TABLE client_visits (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
    appointment_id INTEGER REFERENCES appointments(id) ON DELETE SET NULL,
    visit_date TIMESTAMP NOT NULL
);

-- Mensajes del asistente AI (opcional, para historial)
CREATE TABLE assistant_messages (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    client_id INTEGER REFERENCES clients(id) ON DELETE SET NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);


-- INSERTS DE PRUEBA

-- Usuarios (artistas/tatuadores)
INSERT INTO users (name, email, password_hash, phone, role)
VALUES
  ('Sofía Martínez', 'sofia.martinez@ink.com', 'hash1', '555-1111', 'artist'),
  ('Luis Torres', 'luis.torres@ink.com', 'hash2', '555-2222', 'artist'),
  ('Andrea Gómez', 'andrea.gomez@ink.com', 'hash3', '555-3333', 'admin');

-- Clientes
INSERT INTO clients (name, email, phone, style, notes)
VALUES
  ('Juan Pérez', 'juan.perez@mail.com', '555-4444', 'Realismo', 'Prefiere tatuajes grandes.'),
  ('Ana Gómez', 'ana.gomez@mail.com', '555-5555', 'Minimalista', 'Alérgica a ciertos pigmentos.'),
  ('Carlos Ruiz', 'carlos.ruiz@mail.com', '555-6666', 'Tradicional', NULL);

-- Citas
INSERT INTO appointments (client_id, user_id, date, duration, status, notes)
VALUES
  (1, 1, '2024-07-15 15:00:00', 90, 'scheduled', 'Primera sesión'),
  (2, 2, '2024-07-16 11:00:00', 60, 'completed', 'Tatuaje terminado'),
  (3, 1, '2024-07-18 10:30:00', 120, 'scheduled', NULL);

-- Portafolio
INSERT INTO portfolio (user_id, client_id, image_url, description)
VALUES
  (1, 1, 'https://example.com/portfolio/dragon.jpg', 'Dragón realista en brazo'),
  (2, 2, 'https://example.com/portfolio/flower.jpg', 'Flor minimalista en tobillo'),
  (1, 3, 'https://example.com/portfolio/skull.jpg', 'Calavera tradicional en espalda');

-- Etiquetas automáticas para portafolio
INSERT INTO portfolio_tags (portfolio_id, tag)
VALUES
  (1, 'dragón'),
  (1, 'realismo'),
  (2, 'flor'),
  (2, 'minimalista'),
  (3, 'calavera'),
  (3, 'tradicional');

-- Historial de visitas de clientes
INSERT INTO client_visits (client_id, appointment_id, visit_date)
VALUES
  (1, 1, '2024-07-15 15:00:00'),
  (2, 2, '2024-07-16 11:00:00'),
  (3, 3, '2024-07-18 10:30:00');

-- Mensajes del asistente AI
INSERT INTO assistant_messages (user_id, client_id, message)
VALUES
  (1, 1, 'Hola Juan, recuerda hidratar la zona del tatuaje.'),
  (2, 2, 'Ana, tu cita está confirmada para el martes.'),
  (1, 3, 'Carlos, ¿quieres ver más diseños tradicionales?');



alter table users
add column profile_image_url text,
add column city varchar,
add column specialties text[],
add column profile_url text;
alter table users
add column gallery_images jsonb;

UPDATE users SET password_hash = '$2b$12$JPDpDqztOMI9Jj0mApr9FeOFTAvV.Uf3HrT1sg1PXpCzUZXwQgmpe' WHERE email = 'sofia.martinez@ink.com';
UPDATE users SET password_hash = '$2b$12$JPDpDqztOMI9Jj0mApr9FeOFTAvV.Uf3HrT1sg1PXpCzUZXwQgmpe' WHERE email = 'luis.torres@ink.com';
UPDATE users SET password_hash = '$2b$12$JPDpDqztOMI9Jj0mApr9FeOFTAvV.Uf3HrT1sg1PXpCzUZXwQgmpe' WHERE email = 'andrea.gomez@ink.com';
UPDATE users SET password_hash = '$2b$12$JPDpDqztOMI9Jj0mApr9FeOFTAvV.Uf3HrT1sg1PXpCzUZXwQgmpe' WHERE email = 'amara@ink.com';
UPDATE users SET password_hash = '$2b$12$JPDpDqztOMI9Jj0mApr9FeOFTAvV.Uf3HrT1sg1PXpCzUZXwQgmpe' WHERE email = 'carlos@ink.com';
UPDATE users SET password_hash = '$2b$12$JPDpDqztOMI9Jj0mApr9FeOFTAvV.Uf3HrT1sg1PXpCzUZXwQgmpe' WHERE email = 'eli@ink.com';

UPDATE users SET role = 'admin' WHERE email = 'sofia.martinez@ink.com';

ALTER TABLE clients ADD COLUMN preferences JSON;