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