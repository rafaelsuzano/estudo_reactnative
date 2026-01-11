FROM node:18-alpine

WORKDIR /app

# Instala Expo CLI globalmente
RUN npm install -g expo-cli

# Copia arquivos de dependências
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia o código da aplicação
COPY . .

# Expõe a porta padrão do Expo (19000 para web, 19001 para LAN, 19002 para tunnel)
EXPOSE 19000 19001 19002

# Comando para iniciar o Expo
CMD ["npx", "expo", "start", "-c"]
