FROM node:20-alpine

WORKDIR /app

# Copia arquivos de dependências
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia o código da aplicação
COPY . .

# Expõe a porta padrão do Expo (8081 para web, 19000 para web dev server)
EXPOSE 8081 19000

# Comando para iniciar o Expo no modo web
CMD ["npx", "expo", "start", "--web", "-c"]
