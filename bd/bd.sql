-- Criar tabela usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    usuario VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL
);

-- Inserir usuário padrão
INSERT INTO usuarios (usuario, senha) VALUES ('rafael', '123');
