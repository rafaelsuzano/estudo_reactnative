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
- **Frontend Expo Web**: http://localhost:8081 (inicia automaticamente no modo web)
- **PostgreSQL**: localhost:5432

### Troubleshooting

**Erro: "port 3000 is already in use"**
- Se você tiver o backend rodando localmente, pare-o antes de usar Docker
- Verifique processos usando a porta: `lsof -i :3000`
- Pare o processo: `kill <PID>` ou pare o servidor Node.js local

**Erro: "port 5432 is already in use"**
- Pare qualquer instância local do PostgreSQL antes de usar Docker
- Ou altere a porta no `docker-compose.yml`

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

