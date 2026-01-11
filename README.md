# Gestão de Frota

## Executar com Docker (Recomendado)

### Primeira execução
```bash
# Subir todos os serviços (database, backend e frontend)
docker-compose up -d

# Ou para ver os logs em tempo real
docker-compose up
```

### Comandos úteis
```bash
# Parar todos os serviços
docker-compose down

# Parar e remover volumes (limpar dados do banco)
docker-compose down -v

# Ver logs dos serviços
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres

# Reconstruir as imagens
docker-compose build --no-cache

# Acessar o shell do container backend
docker-compose exec backend sh

# Acessar o shell do container frontend
docker-compose exec frontend sh
```

### URLs dos serviços
- **Backend API**: http://localhost:3000
- **Frontend Expo**: http://localhost:19000 (web)
- **PostgreSQL**: localhost:5432

## Executar localmente (sem Docker)

### Back End
```bash
cd backend
node server.js
```

### Front End
```bash
cd frontEnd
npx expo start -c
```

### Banco de Dados
Certifique-se de que o PostgreSQL está rodando e atualize as variáveis de ambiente no arquivo `.env` ou em `backend/db.js`.

